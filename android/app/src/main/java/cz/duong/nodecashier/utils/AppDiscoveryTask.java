package cz.duong.nodecashier.utils;

import android.util.Log;

import java.io.IOException;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceListener;

/**
 * @author d^2
 */

public class AppDiscoveryTask implements Runnable {
    private static final String SERVICE_TYPE = "_http._tcp.local.";
    private static final String SERVICE_NAME = "nodecashier-services";

    private UrlListener urlListener;
    private JmDNS jmdns;

    public AppDiscoveryTask(UrlListener listener) {
        this.urlListener = listener;

    }
    private void urlDiscovered(String url) {
        if (urlListener != null) urlListener.onUrlReceived(url);
    }

    private ServiceListener listener = new ServiceListener() {
        @Override
        public void serviceAdded(ServiceEvent event) {
            Log.d("APP-DISCOVERY", event.getName());
            jmdns.requestServiceInfo(event.getType(), event.getName(), 1);
        }

        @Override
        public void serviceRemoved(ServiceEvent event) {
            Log.d("APP-DISCOVERY", "Removed: " + event.getName());
        }

        @Override
        public void serviceResolved(ServiceEvent event) {
            Log.d("APP-DISCOVER", "RESOLVED: " + event.getName());
            if (event.getName().equals(SERVICE_NAME) && event.getInfo().getURLs().length > 0 && event.getInfo().getInet4Addresses().length > 0) {
                urlDiscovered(event.getInfo().getURLs()[0]);
            }
        }
    };

    @Override
    public void run() {
        try {
            Log.d("APP-DISCOVER", "NEW TASK");
            jmdns = JmDNS.create();
            jmdns.addServiceListener(SERVICE_TYPE, listener);
        } catch (IOException e) {
            Log.d("APP-DISCOVER", Log.getStackTraceString(e));
        }
    }

    public void stop() {
        if (jmdns != null) {
            jmdns.removeServiceListener(SERVICE_TYPE, listener);
            try {
                jmdns.close();
            } catch (IOException e) {
                Log.d("APP-DISCOVER", Log.getStackTraceString(e));
            }
        }
    }

    public interface UrlListener {
        void onUrlReceived(String url);
    }
}
