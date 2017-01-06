package cz.duong.nodecashier;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.PowerManager;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;

import java.util.List;

public class MainActivity extends Activity implements ExitDialog.ExitInterface, AppInterface.AppLoadListener {

    private AppDiscovery appDiscovery;
    private WebView webView;
    private ProgressBar progressBar;

    private static final String HOME_EXTRA = "android.intent.extra.FROM_HOME_KEY";

    private BroadcastReceiver powerReceiver;
    private PowerManager.WakeLock wakeLock;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final Intent intent = getIntent();
        final String intentAction = intent.getAction();

        this.getWindow().addFlags(WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);

        if (intent.hasCategory(Intent.CATEGORY_LAUNCHER) && intentAction != null && intentAction.equals(Intent.ACTION_MAIN)) {

            if (!isLauncher()) {
                PackageManager p = getPackageManager();
                ComponentName cN = new ComponentName(this, FakeHomeActivity.class);
                p.setComponentEnabledSetting(cN, PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP);

                Intent selector = new Intent(Intent.ACTION_MAIN);
                selector.addCategory(Intent.CATEGORY_HOME);
                startActivity(selector);

                p.setComponentEnabledSetting(cN, PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
            }

            Intent mHomeIntent = new Intent(Intent.ACTION_MAIN, null);
            mHomeIntent.addCategory(Intent.CATEGORY_HOME);
            mHomeIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            mHomeIntent.putExtra(HOME_EXTRA, true);

            finish();
            startActivity(mHomeIntent);
            Runtime.getRuntime().exit(0);

            return;
        }

        initFullscreen();
        setContentView(R.layout.activity_main);

        webView = (WebView) findViewById(R.id.webView);
        progressBar = (ProgressBar) findViewById(R.id.progressBar);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setSaveFormData(false);

        webView.addJavascriptInterface(new AppInterface(webView, this), "android");
        WebView.setWebContentsDebuggingEnabled(true);

        appDiscovery = new AppDiscovery(this, new AppDiscovery.UrlListener() {
            @Override
            public void onUrlReceived(String url) {
                webView.loadUrl(url);
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.w("APPWEBVIEW", "LOADED URL:" + url);
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
                super.onReceivedHttpError(view, request, errorResponse);
                Log.w("APPWEBVIEW", "Http error: " + errorResponse.getStatusCode() + " -> " + request.getUrl().getPath());
//                if (errorResponse.getStatusCode() == 404 && !request.getUrl().getPath().contains("favicon.ico")) {
//                    hideBrowser();
//                    appDiscovery.rediscover();
//                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                Log.w("APPWEBVIEW", "RECEIVED ERROR: "+error.getDescription() + " : " + error.getErrorCode());
                if (error.getErrorCode() == -2) {
                    hideBrowser();
                    appDiscovery.rediscover();
                }

            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                hideBrowser();
            }
        });


        Log.d("APP-LIFECYCLE", "DISCOVERING IN ONCREATE");
        hideBrowser();
        appDiscovery.discover();

        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_OFF);

        powerReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Log.d("AM-SLEEP", "OFF RECEIVED");
                PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
                wakeLock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE, "NW-WAKELOCK");
                wakeLock.acquire();
            }
        };

        registerReceiver(powerReceiver, filter);
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (webView != null) {
            webView.requestFocus();
        }
        Log.d("APP-LIFECYCLE", "ON RESUME");
    }

    private void hideBrowser() {
        if (progressBar != null) {
            progressBar.setVisibility(View.VISIBLE);
        }

        if (webView != null) {
            webView.setVisibility(View.GONE);
        }
    }

    private void showBrowser() {
        if (progressBar != null) {
            progressBar.setVisibility(View.GONE);
        }

        if (webView != null) {
            webView.setVisibility(View.VISIBLE);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (appDiscovery != null) {
            appDiscovery.destroy();
            appDiscovery = null;
        }

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

        ActivityManager am = (ActivityManager) getApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
        am.moveTaskToFront(getTaskId(), 0);
    }

    private void initFullscreen() {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        final View decorView = getWindow().getDecorView();
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

    private boolean isLauncher() {
        final Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);
        final ResolveInfo res = getPackageManager().resolveActivity(intent, 0);
        return res.activityInfo != null &&
                !"android".equals(res.activityInfo.packageName) &&
                res.activityInfo.packageName.equals(BuildConfig.APPLICATION_ID);
    }

    @Override
    public void onShowStats() {
        webView.loadUrl("javascript:showStats()");
    }

    @Override
    public void onShowRegister() {
        webView.loadUrl("javascript:showClient()");
    }

    @Override
    public void onExit() {
        PackageManager pm = getPackageManager();
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);

        List<ResolveInfo> launchers = pm.queryIntentActivities(intent, 0);

        if (launchers != null && !launchers.isEmpty()) {
            for (ResolveInfo resolveInfo : launchers) {

                if (!resolveInfo.activityInfo.packageName.contains("cz.duong.nodecasher")) {
                    finish();

                    ActivityInfo activity = resolveInfo.activityInfo;
                    ComponentName name = new ComponentName(activity.applicationInfo.packageName, activity.name);
                    Intent i = new Intent(Intent.ACTION_MAIN);

                    i.addCategory(Intent.CATEGORY_LAUNCHER);
                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
                    i.setComponent(name);

                    startActivity(i);
                    break;
                }

            }
        }
    }

    @Override
    public void onReload() {
        webView.reload();
    }

    @Override
    public void onRediscover() {
        Toast.makeText(this, "Znova načítám", Toast.LENGTH_LONG).show();
        appDiscovery.rediscover();
    }

    @Override
    public void onAppLoaded() {
        showBrowser();
    }

    @Override
    public void onNightToggle() {
        webView.loadUrl("javascript:toggleNight()");
    }
}
