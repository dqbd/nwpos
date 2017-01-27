package cz.duong.nodecashier.utils;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import cz.duong.nodecashier.MainActivity;

import java.util.List;

/**
 * @author d^2
 */

public class LauncherUtils {

    private static final String HOME_EXTRA = "android.intent.extra.FROM_HOME_KEY";

    public static Intent getOtherLauncher(final Context context) {
        PackageManager pm = context.getPackageManager();
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);

        List<ResolveInfo> launchers = pm.queryIntentActivities(intent, 0);

        if (launchers != null && !launchers.isEmpty()) {
            for (ResolveInfo resolveInfo : launchers) {
                if (!resolveInfo.activityInfo.packageName.contains("cz.duong.nodecasher")) {
                    ActivityInfo activity = resolveInfo.activityInfo;
                    ComponentName name = new ComponentName(activity.applicationInfo.packageName, activity.name);
                    Intent i = new Intent(Intent.ACTION_MAIN);

                    i.setAction(Intent.ACTION_MAIN);
                    i.addCategory(Intent.CATEGORY_LAUNCHER);
                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
                    i.setComponent(name);

                    return i;
                }
            }
        }

        return null;
    }

    public static void setFullscreen(final Activity activity) {
        activity.requestWindowFeature(Window.FEATURE_NO_TITLE);
        activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        final View decorView = activity.getWindow().getDecorView();
        final int uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;

        decorView.setSystemUiVisibility(uiOptions);
        decorView.setOnSystemUiVisibilityChangeListener(new View.OnSystemUiVisibilityChangeListener() {
            @Override
            public void onSystemUiVisibilityChange(int visibility) {
                if ((visibility & View.SYSTEM_UI_FLAG_FULLSCREEN) == 0) {
                    decorView.setSystemUiVisibility(uiOptions);
                }
            }
        });
    }

    public static boolean restartToLauncher(final Activity activity) {
        final Intent intent = activity.getIntent();
        final String intentAction = intent.getAction();

        if (intent.hasCategory(Intent.CATEGORY_LAUNCHER) && intentAction != null && intentAction.equals(Intent.ACTION_MAIN)) {
            if (!FakeHomeActivity.isLauncher(activity)) {
                PackageManager p = activity.getPackageManager();
                ComponentName cN = new ComponentName(activity, FakeHomeActivity.class);
                p.setComponentEnabledSetting(cN, PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP);

                Intent selector = new Intent(Intent.ACTION_MAIN);
                selector.addCategory(Intent.CATEGORY_HOME);
                activity.startActivity(selector);

                p.setComponentEnabledSetting(cN, PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
            }



            activity.finish();
            activity.startActivity(getHomeIntent(activity));
            Runtime.getRuntime().exit(0);

            return true;
        }

        return false;
    }

    public static Intent getHomeIntent(final Context context) {
        Intent mHomeIntent = new Intent(Intent.ACTION_MAIN, null);
        mHomeIntent.addCategory(Intent.CATEGORY_HOME);
        mHomeIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        mHomeIntent.putExtra(HOME_EXTRA, true);
        mHomeIntent.setClass(context, MainActivity.class);

        return mHomeIntent;
    }
}
