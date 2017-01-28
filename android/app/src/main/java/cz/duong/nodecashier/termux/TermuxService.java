package cz.duong.nodecashier.termux;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.net.Uri;
import android.os.Binder;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import cz.duong.nodecashier.MainActivity;
import cz.duong.nodecashier.R;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * A service holding a list of terminal sessions, showing a foreground notification while
 * running so that it is not terminated. The user interacts with the session through {@link MainActivity}, but this
 * service may outlive the activity when the user or the system disposes of the activity. In that case the user may
 * restart {@link MainActivity} later to yet again access the sessions.
 * <p/>
 * In order to keep both terminal sessions and spawned processes (who may outlive the terminal sessions) alive as long
 * as wanted by the user this service is a foreground service, {@link Service#startForeground(int, Notification)}.
 * <p/>
 * Optionally may hold a wake and a wifi lock, in which case that is shown in the notification - see
 * {@link #buildNotification()}.
 */
public final class TermuxService extends Service {

    /** Note that this is a symlink on the Android M preview. */
    @SuppressLint("SdCardPath")
    public static final String FILES_PATH = "/data/data/com.termux/files";
    public static final String PREFIX_PATH = FILES_PATH + "/usr";
    public static final String HOME_PATH = FILES_PATH + "/home";

    private static final int NOTIFICATION_ID = 1337;

    public static final String ACTION_STOP_SERVICE = "com.termux.service_stop";
    public static final String ACTION_EXECUTE = "com.termux.service_execute";
    public static final String EXTRA_ARGUMENTS = "com.termux.execute.arguments";

    public static final String EXTRA_CURRENT_WORKING_DIRECTORY = "com.termux.execute.cwd";
    public static final String EXTRA_EXECUTE_IN_BACKGROUND = "com.termux.execute.background";
    public static final String EXTRA_TITLE = "com.termux.execute.title";

    final static String BOOT_PATH = HOME_PATH + "/.termux/boot";

    /** This service is only bound from inside the same process and never uses IPC. */
    public class LocalBinder extends Binder {
        public final TermuxService service = TermuxService.this;
    }

    private final IBinder mBinder = new LocalBinder();
    private final Handler mHandler = new Handler();

    public TaskListener mListener;

    BackgroundJob backgroundJob;

    /** If the user has executed the {@link #ACTION_STOP_SERVICE} intent. */
    boolean mWantsToStop = false;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent.getAction();
        if (ACTION_STOP_SERVICE.equals(action)) {
            if (backgroundJob != null) {
                backgroundJob.finishIfRunning();
                backgroundJob = null;

                updateNotification();
            }
        } else if (ACTION_EXECUTE.equals(action)) {
            Uri executableUri = intent.getData();
            String executablePath = (executableUri == null ? null : executableUri.getPath());

            String[] arguments = (executableUri == null ? null : intent.getStringArrayExtra(EXTRA_ARGUMENTS));
            String cwd = intent.getStringExtra(EXTRA_CURRENT_WORKING_DIRECTORY);

            if (intent.getBooleanExtra(EXTRA_EXECUTE_IN_BACKGROUND, false)) {
                if (backgroundJob != null) {
                    backgroundJob.finishIfRunning();
                    backgroundJob = null;
                }

                backgroundJob = new BackgroundJob(cwd, executablePath, arguments, this, intent.getStringExtra(EXTRA_TITLE));

                updateNotification();
            }
        } else if (action != null) {
            Log.e(EmulatorDebug.LOG_TAG, "Unknown TermuxService action: '" + action + "'");
        }

        return Service.START_NOT_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    @Override
    public void onCreate() {
        startForeground(NOTIFICATION_ID, buildNotification());
    }

    /** Update the shown foreground service notification after making any changes that affect it. */
    private void updateNotification() {
        ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).notify(NOTIFICATION_ID, buildNotification());
    }

    private Notification buildNotification() {
        Intent notifyIntent = new Intent(this, MainActivity.class);
        // PendingIntent#getActivity(): "Note that the activity will be started outside of the context of an existing
        // activity, so you must use the Intent.FLAG_ACTIVITY_NEW_TASK launch flag in the Intent":
        notifyIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notifyIntent, 0);

        String contentText = "Vrátit se do pokladny";
        if (backgroundJob != null) {
            contentText = "Server běží";
        }

        Notification.Builder builder = new Notification.Builder(this);
        builder.setContentTitle(getText(R.string.app_name));
        builder.setContentText(contentText);
        builder.setSmallIcon(R.drawable.icon_notification);
        builder.setContentIntent(pendingIntent);
        builder.setOngoing(true);

        // No need to show a timestamp:
        builder.setShowWhen(false);

        // Background color for small notification icon:
        builder.setColor(0xFF000000);

        return builder.build();
    }

    @Override
    public void onDestroy() {
        stopForeground(true);
    }

    public void onBackgroundJobExited(final String name, final int exitCode) {
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                if (mListener != null) mListener.onStopped(name, exitCode);
                backgroundJob = null;
                updateNotification();
            }
        });
    }

    public void onBackgroundJobStarted(final String name) {
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                if (mListener != null) mListener.onStarted(name);
            }
        });
    }

    public static void runScript(Task task, Context context, ServiceConnection service) {
        File root = new File(BOOT_PATH);
        if (!root.exists()) root.mkdirs();

        File file = new File(root, "tmp.sh");

        try {
            InputStream inputStream = context.getResources().openRawResource(task.rid);
            try (OutputStream outputStream = new FileOutputStream(file)) {
                byte[] buffer = new byte[4 * 1024];
                int read;
                while ((read = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, read);
                }
                outputStream.flush();
            }
        } catch (IOException e) {
            Log.d(EmulatorDebug.LOG_TAG, Log.getStackTraceString(e));
        }

        if (!file.canWrite()) file.setWritable(true);
        if (!file.canRead()) file.setReadable(true);
        if (!file.canExecute()) file.setExecutable(true);

        Uri scriptUri = new Uri.Builder().scheme("com.termux.file").path(file.getAbsolutePath()).build();

        Intent executeIntent = new Intent(ACTION_EXECUTE, scriptUri);
        executeIntent.setClass(context, TermuxService.class);
        executeIntent.putExtra(EXTRA_EXECUTE_IN_BACKGROUND, true);

        if (task.args != null) {
            executeIntent.putExtra(EXTRA_ARGUMENTS, task.args);
        }

        executeIntent.putExtra(EXTRA_TITLE, task.name());

        context.startService(executeIntent);
        if (!context.bindService(executeIntent, service, 0))
            throw new RuntimeException("bindService() failed");
    }

    public interface TaskListener {
        void onStarted(String name);
        void onStopped(String name, int exitCode);
    }
}
