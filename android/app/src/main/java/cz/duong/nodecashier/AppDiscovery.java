package cz.duong.nodecashier;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import java.net.Inet6Address;

/**
 * @author d^2
 */

class AppDiscovery {
    private static final String PREFS_NAME = "MyPrefsFile";
    private static final String SERVICE_TYPE = "_http._tcp";
    private static final String SERVICE_NAME = "nodecashier-services";

    private Context context;
    private UrlListener urlListener;

    private Handler handler;
    private Handler uiHandler;
    private NsdManager nsdManager;

    private NsdListener nsdListener;

    private boolean urlFound = false;

    AppDiscovery(Context context, UrlListener urlListener) {
        this.context = context;
        this.urlListener = urlListener;

        nsdManager = (NsdManager) context.getSystemService(Context.NSD_SERVICE);
        handler = new Handler();
        uiHandler = new Handler(Looper.getMainLooper());
    }

    void discover() {
        SharedPreferences preferences = context.getSharedPreferences(PREFS_NAME, 0);
        String url = preferences.getString("URL", null);

        if (url != null && !url.isEmpty()) {
            urlFound = true;

            Log.d("AppDiscovery", "URL FOUND IN PREF: " + url);
            urlDiscovered(url, false);
            return;
        }

        Log.d("AppDiscovery", "URL NOT FOUND, QUERYING");

        attempt();
    }

    void rediscover() {
        Log.d("AppDiscovery", "HTTP ERROR, REDISCOVERING");

        urlFound = false;
        SharedPreferences preferences = context.getSharedPreferences(PREFS_NAME, 0);
        SharedPreferences.Editor editor = preferences.edit();
        editor.clear().apply();

        discover();
    }

    private void attempt() {
        nsdListener = new NsdListener();
        nsdManager.discoverServices(SERVICE_TYPE, NsdManager.PROTOCOL_DNS_SD, nsdListener);
    }

    void destroy() {
        handler.removeCallbacksAndMessages(null);
        uiHandler.removeCallbacksAndMessages(null);

        try {
            nsdManager.stopServiceDiscovery(nsdListener);
        } catch (IllegalArgumentException ignored) {}
    }

    private void urlDiscovered(String url) {
        urlDiscovered(url, true);
    }

    private void urlDiscovered(final String url, boolean store) {
        if (store) {
            SharedPreferences preferences = context.getSharedPreferences(PREFS_NAME, 0);
            SharedPreferences.Editor editor = preferences.edit();
            editor.putString("URL", url);
            editor.apply();
        }

        if (this.urlListener != null) {
            urlFound = true;
            uiHandler.post(new Runnable() {
                @Override
                public void run() {
                    urlListener.onUrlReceived(url);
                }
            });
        }
    }

    private class NsdListener implements NsdManager.DiscoveryListener {
        @Override
        public void onStartDiscoveryFailed(String serviceType, int errorCode) {
            Log.d("AppDiscovery", "start discovery failed: " + errorCode);
            tryToStopListener();
        }

        @Override
        public void onStopDiscoveryFailed(String serviceType, int errorCode) {
            Log.d("AppDiscovery", "stop discovery failed: " + errorCode);
            tryToStopListener();
        }

        @Override
        public void onDiscoveryStarted(String serviceType) {
            if (handler != null) {
                Log.d("AppDiscovery", "discovery started");
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        Log.d("AppDiscovery", "discovery timeout");
                        tryToStopListener();
                    }
                }, 20000);
            }
        }

        @Override
        public void onDiscoveryStopped(String serviceType) {
            if (handler != null) {
                Log.d("AppDiscovery", "discovery stopped");
                handler.removeCallbacksAndMessages(null);

                if (!urlFound) {
                    Log.d("AppDiscovery", "url still not found, delaying attempt");
                    handler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            attempt();
                        }
                    }, 2000);
                }
            }
        }

        @Override
        public void onServiceFound(NsdServiceInfo serviceInfo) {
            if (serviceInfo.getServiceType().contains("_http._tcp")
                    && serviceInfo.getServiceName().equals(SERVICE_NAME)) {

                Log.d("AppDiscovery", "trying to resolve");
                nsdManager.resolveService(serviceInfo, new NsdManager.ResolveListener() {
                    @Override
                    public void onResolveFailed(NsdServiceInfo serviceInfo, int errorCode) {
                        Log.d("AppDiscovery", "error: "+errorCode);
                    }

                    @Override
                    public void onServiceResolved(final NsdServiceInfo serviceInfo) {
                        urlFound = true;
                        tryToStopListener();

                        String urlBuilder = "http://" +
                                serviceInfo.getHost().getHostAddress() +
                                ":" +
                                serviceInfo.getPort();

                        if (serviceInfo.getHost() instanceof Inet6Address) {
                            urlBuilder = "http://[" +
                                    serviceInfo.getHost().getHostAddress() +
                                    "]:" +
                                    serviceInfo.getPort();
                        }

                        Log.d("AppDiscovery", "url found: " + urlBuilder);
                        urlDiscovered(urlBuilder);
                    }
                });
            }

        }

        private void tryToStopListener() {
            try {
                nsdManager.stopServiceDiscovery(NsdListener.this);
            } catch (IllegalArgumentException ignored) {}
        }

        @Override
        public void onServiceLost(NsdServiceInfo serviceInfo) {}
    }

    interface UrlListener {
        void onUrlReceived(String url);
    }
}
