package cz.duong.nodecashier;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import android.net.wifi.WifiManager;
import android.os.AsyncTask;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.util.Log;

import java.io.IOException;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.UnknownHostException;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceListener;

/**
 * @author d^2
 */

class AppDiscovery {
    private static final String PREFS_NAME = "MyPrefsFile";
    private static final String SERVICE_TYPE = "_http._tcp.local.";
    private static final String SERVICE_NAME = "nodecashier-services";

    private Context context;
    private UrlListener urlListener;

    private WifiManager.MulticastLock lock;

    private HandlerThread handlerThread;
    private Handler handler;
    private Handler uiHandler;

    AppDiscovery(Context context, UrlListener urlListener) {
        this.context = context;
        this.urlListener = urlListener;

        this.handlerThread = new HandlerThread("AppDiscovery");
        this.handlerThread.start();

        this.handler = new Handler(handlerThread.getLooper());
        this.uiHandler = new Handler(Looper.getMainLooper());
    }

    void setup() {
        Log.d("APP-DISCOVERY", "setup");
        WifiManager wifi = (WifiManager) context.getSystemService(android.content.Context.WIFI_SERVICE);
        lock = wifi.createMulticastLock("HeeereDnssdLock");
        lock.setReferenceCounted(true);
        lock.acquire();
    }

    void discover() {
        SharedPreferences preferences = context.getSharedPreferences(PREFS_NAME, 0);
        String url = preferences.getString("URL", null);

        if (url != null && !url.isEmpty()) {
            Log.d("APP-DISCOVERY", "URL FOUND IN PREF: " + url);
            urlDiscovered(url, false);
        } else {
            postTask();
        }
    }

    void rediscover() {
        SharedPreferences preferences = context.getSharedPreferences(PREFS_NAME, 0);
        SharedPreferences.Editor editor = preferences.edit();
        editor.clear().apply();
        postTask();
    }

    void clear() {
        handler.removeCallbacksAndMessages(null);
        uiHandler.removeCallbacksAndMessages(null);
        if (lock != null) {
            lock.release();
        }
    }

    private void postTask() {
        handler.post(new AppDiscoveryTask(new AppDiscoveryTask.UrlListener() {
            @Override
            public void onUrlReceived(String url) {
                urlDiscovered(url, true);
            }
        }));
    }

    private void urlDiscovered(final String url, boolean store) {
        if (store) {
            SharedPreferences preferences = context.getSharedPreferences(PREFS_NAME, 0);
            SharedPreferences.Editor editor = preferences.edit();
            editor.putString("URL", url);
            editor.apply();
        }

        if (this.urlListener != null) {
            uiHandler.post(new Runnable() {
                @Override
                public void run() {
                    urlListener.onUrlReceived(url);
                }
            });
        }
    }

    interface UrlListener {
        void onUrlReceived(String url);
    }
}
