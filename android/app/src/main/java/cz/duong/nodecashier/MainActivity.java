package cz.duong.nodecashier;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.ProgressBar;

import com.duong.R;
import cz.duong.nodecashier.termux.Task;
import cz.duong.nodecashier.termux.TermuxService;
import cz.duong.nodecashier.utils.LauncherUtils;

import java.util.HashMap;
import java.util.Map;

import static cz.duong.nodecashier.termux.EmulatorDebug.LOG_TAG;
import static cz.duong.nodecashier.termux.TermuxService.ACTION_STOP_SERVICE;

public class MainActivity extends Activity implements ExitDialog.ExitInterface, AppInterface.AppLoadListener, ServiceConnection {

    private final static int MAX_ATTEMPTS = 3;

    private WebView webView;

    private View errorView;
    private ProgressBar progressBar;

    private PowerManager.WakeLock wakeLock;

    private Map<String, String> actions = new HashMap<>();

    private Handler mHandler = new Handler(Looper.getMainLooper());
    private TermuxService termuxService;

    private boolean isClosing = false;
    private int attempts = 0;


    private BroadcastReceiver powerReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);

            //noinspection deprecation
            wakeLock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE, "NW-WAKELOCK");
            wakeLock.acquire();
        }
    };

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.getWindow().addFlags(WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);
        LauncherUtils.setFullscreen(this);

        if (AppPreferences.shouldFirstInit(this)) {
            showSetup();
            return;
        }

        if (LauncherUtils.restartToLauncher(this)) {
            return;
        }

        setContentView(R.layout.activity_main);

        if (AppPreferences.shouldRunServer(this)) {
            Intent serviceIntent = new Intent(this, TermuxService.class);

            startService(serviceIntent);
            if (!bindService(serviceIntent, this, 0))
                throw new RuntimeException("bindService() failed");
        } else {
            loadPage();
        }

        webView = (WebView) findViewById(R.id.webView);
        progressBar = (ProgressBar) findViewById(R.id.progressBar);
        errorView = findViewById(R.id.main_error);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setSaveFormData(false);

        webView.addJavascriptInterface(new AppInterface(webView, this), AppInterface.JS_NAME);
        webView.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                return true;
            }
        });
        webView.setHapticFeedbackEnabled(false);
        WebView.setWebContentsDebuggingEnabled(true);

        Button reloadButton = (Button) findViewById(R.id.retry_btn);
        reloadButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                attempts = 0;
                loadPage();
            }
        });

        Button setupButton = (Button) findViewById(R.id.setup_btn);
        setupButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showSetup();
            }
        });

        hideError();
        hideBrowser();
        registerReceiver(powerReceiver, new IntentFilter(Intent.ACTION_SCREEN_OFF));
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.requestFocus();
    }

    private void hideBrowser() {
        if (progressBar != null) progressBar.setVisibility(View.VISIBLE);
        if (webView != null) webView.setVisibility(View.GONE);
    }

    private void showBrowser() {
        if (progressBar != null) progressBar.setVisibility(View.GONE);
        if (webView != null) webView.setVisibility(View.VISIBLE);
    }

    private void showError() {
        if (errorView != null) errorView.setVisibility(View.VISIBLE);
    }

    private void hideError() {
        if (errorView != null) errorView.setVisibility(View.GONE);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (powerReceiver != null) {
            try {
                unregisterReceiver(powerReceiver);
            } catch (IllegalArgumentException ignored) {}

            powerReceiver = null;
        }

        if (wakeLock != null) {
            wakeLock.release();
            wakeLock = null;
        }
    }

    @Override
    public void onBackPressed() {}

    @Override
    public boolean onKeyLongPress(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            ExitDialog dialog = new ExitDialog(this, this);

            if (dialog.getWindow() == null) return super.onKeyLongPress(keyCode, event);

            dialog.getWindow().setFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE, WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);
            dialog.show();
            dialog.getWindow().getDecorView().setSystemUiVisibility(getWindow().getDecorView().getSystemUiVisibility());
            dialog.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);
            return true;
        }

        return super.onKeyLongPress(keyCode, event);
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (!isClosing) {
            ActivityManager am = (ActivityManager) getApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
            am.moveTaskToFront(getTaskId(), 0);
        }
    }

    @Override
    public void onJavascriptFunction(String function) {
        webView.loadUrl("javascript:"+function+"()");
    }

    @Override
    public void onExit() {
        isClosing = true;

        startService(new Intent(this, TermuxService.class).setAction(ACTION_STOP_SERVICE));

        Intent launcher = LauncherUtils.getOtherLauncher(this);
        startActivity(launcher);
        finish();
    }

    @Override
    public void onReload() {
        webView.reload();
    }

    private void showSetup() {
        isClosing = true;
        Intent intent = new Intent(this, SetupActivity.class);
        startActivity(intent);
        finish();
    }

    @Override
    public void onAppLoaded(Map<String, String> actions) {
        this.actions = actions;
        this.attempts = 0;
        showBrowser();
    }

    @Override
    public Map<String, String> getActions() {
        return this.actions;
    }

    void loadPage() {
        if (attempts < MAX_ATTEMPTS) {
            attempts += 1;
            mHandler.removeCallbacksAndMessages(null);
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    hideError();
                    hideBrowser();
                }
            });

            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    Log.d(LOG_TAG, "Attempting to load: "+ AppPreferences.getServerUrl(MainActivity.this));
                    webView.loadUrl(AppPreferences.getServerUrl(MainActivity.this));
                    hideBrowser();
                    hideError();
                }
            }, 5000);
        } else {
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    showError();
                }
            });
            //show errr
        }
    }

    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {
        termuxService = ((TermuxService.LocalBinder) service).service;
        termuxService.mListener = new TermuxService.TaskListener() {
            @Override
            public void onStarted(String name) {
                if (Task.fromName(name) == Task.RUN) {
                    loadPage();
                }
            }

            @Override
            public void onStopped(String name, int exitCode) {
                if (Task.fromName(name) == Task.RUN) {
                    hideBrowser();
                }
            }
        };

        TermuxService.runScript(Task.RUN, this, this);
    }

    @Override
    public void onRediscover() {
        showSetup();
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
        termuxService = null;
    }
}
