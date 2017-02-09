package cz.duong.nodecashier.utils;

import android.app.Activity;
import android.net.wifi.WifiManager;
import android.util.Log;

import java.io.IOException;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Collections;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceListener;

/**
 * @author d^2
 */

public class AppDiscoveryTask implements Runnable {
    private static final String SERVICE_TYPE = "_http._tcp.local.";
    private static final String SERVICE_NAME = "nodecashier-service";

    private static final String DNS_LOCK = "cz.duong.nodecashier.lock";

    private WifiManager.MulticastLock lock;
    private UrlListener urlListener;
    private JmDNS jmdns;

    private InetAddress deviceAddress;

    public AppDiscoveryTask(Activity context, UrlListener listener) {
        this.urlListener = listener;

        WifiManager wifi = (WifiManager) context.getSystemService(android.content.Context.WIFI_SERVICE);

        deviceAddress = getLocalAddress();

        lock = wifi.createMulticastLock(DNS_LOCK);
        lock.setReferenceCounted(true);
        lock.acquire();
    }

    private InetAddress getLocalAddress() {
        try {
            for(NetworkInterface intf : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                for (InetAddress iadr : Collections.list(intf.getInetAddresses())) {
                    if (iadr.isLoopbackAddress()) continue;

                    String address = iadr.getHostAddress();

                    if (!address.contains(":")) { //je to ipv4
                        return iadr;
                    }
                }
            }
        } catch (SocketException e) {
            Log.d("APP-DISCOVERY", Log.getStackTraceString(e));
        }

        return null;
    }

    private void urlDiscovered(String url) {
        if (urlListener != null) urlListener.onUrlReceived(url);
    }

    private ServiceListener listener = new ServiceListener() {
        @Override
        public void serviceAdded(ServiceEvent event) {
            Log.d("APP-DISCOVERY", "added: " + event.getName() + " : " + event.getType());
//            ServiceInfo info = jmdns.getServiceInfo(event.getType(), event.getName(), 30000);
//            Log.d("APP-DISCOVERY", "info: " + info);

            jmdns.requestServiceInfo(event.getType(), event.getName(), 30000);

        }

        @Override
        public void serviceRemoved(ServiceEvent event) {
            Log.d("APP-DISCOVERY", "Removed: " + event.getName());
        }

        @Override
        public void serviceResolved(ServiceEvent event) {
            Log.d("APP-DISCOVER", "RESOLVED: " + event.getName());
            String[] urls = event.getInfo().getURLs();
            Inet4Address[] addresses = event.getInfo().getInet4Addresses();
            Boolean isOurService = event.getName().contains(SERVICE_NAME);
            if (isOurService && urls.length > 0 && addresses.length > 0) {
                urlDiscovered(event.getInfo().getURLs()[0]);
            }
        }
    };

    @Override
    public void run() {
        try {
            if (deviceAddress != null) {
                Log.d("APP-DISCOVER", "NEW TASK with device address");
                jmdns = JmDNS.create(deviceAddress, deviceAddress.getHostName());
            } else {
                Log.d("APP-DISCOVER", "NEW TASK");
                jmdns = JmDNS.create();
            }

            jmdns.addServiceListener(SERVICE_TYPE, listener);
        } catch (IOException e) {
            Log.d("APP-DISCOVER", Log.getStackTraceString(e));
        }
    }

    public void stop() {
        Log.d("APP-DISCOVER", "Stopping");
        if (jmdns != null) {
            jmdns.unregisterAllServices();

            try {
                jmdns.close();
                jmdns = null;
                Log.d("APP-DISCOVER", "Stopped");
            } catch (IOException e) {
                Log.d("APP-DISCOVER", Log.getStackTraceString(e));
            }
        }

        if (lock != null) {
            lock.release();
            lock = null;
        }
    }

    public interface UrlListener {
        void onUrlReceived(String url);
    }
}
