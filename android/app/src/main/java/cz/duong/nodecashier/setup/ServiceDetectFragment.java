package cz.duong.nodecashier.setup;

import android.app.Fragment;
import android.content.Context;
import android.net.Uri;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;

import cz.duong.nodecashier.utils.AppDiscoveryTask;

public class ServiceDetectFragment extends Fragment {

    WifiManager.MulticastLock lock;
    HandlerThread bgThread;
    Handler handler;

    Handler uiHandler;

    AppDiscoveryTask task;
    UrlAdapter adapter;

    private static final String DNS_LOCK = "cz.duong.nodecashier.lock";

    public ServiceDetectFragment() {}

    public static ServiceDetectFragment newInstance() {
        return new ServiceDetectFragment();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(com.duong.R.layout.fragment_service_detect, container, false);

        ListView listView = (ListView) view.findViewById(com.duong.R.id.service_list);
        listView.setAdapter(adapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                String url = (String) parent.getItemAtPosition(position);
                showServiceSelected(url);
            }
        });

        return view;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        bgThread = new HandlerThread("AppDiscovery");
        bgThread.start();

        WifiManager wifi = (WifiManager) context.getSystemService(android.content.Context.WIFI_SERVICE);
        lock = wifi.createMulticastLock(DNS_LOCK);
        lock.setReferenceCounted(true);
        lock.acquire();

        handler = new Handler(bgThread.getLooper());
        uiHandler = new Handler(Looper.getMainLooper());

        adapter = new UrlAdapter(getContext());
        task = new AppDiscoveryTask(new AppDiscoveryTask.UrlListener() {
            @Override
            public void onUrlReceived(final String url) {
                Log.d("APP-DISCOVERY", url);
                uiHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        adapter.add(url);
                    }
                });
            }
        });

        handler.post(task);
    }

    @Override
    public void onDetach() {
        super.onDetach();

        if (task != null) task.stop();
        if (handler != null) handler.removeCallbacksAndMessages(null);
        if (uiHandler != null) uiHandler.removeCallbacksAndMessages(null);
        if (lock != null) lock.release();

        lock = null;
    }

    class UrlAdapter extends ArrayAdapter<String> {
        UrlAdapter(Context context) {
            super(context, 0, new ArrayList<String>());
        }

        @Override
        public void add(String object) {
            for(int i = 0; i < getCount(); i++) {
                String item = getItem(i);
                if (item != null && item.equalsIgnoreCase(object)) {
                    return;
                }
            }

            super.add(object);
        }

        @Override
        @NotNull
        public View getView(int position, View convertView, @NotNull ViewGroup parent) {
            String action = getItem(position);

            if (convertView == null) {
                convertView = LayoutInflater.from(getContext()).inflate(com.duong.R.layout.server_listitem, parent, false);
            }

            Uri uri = Uri.parse(action);

            TextView name = (TextView) convertView.findViewById(com.duong.R.id.hostname_text);
            name.setText(uri.getHost());

            TextView port = (TextView) convertView.findViewById(com.duong.R.id.port_text);
            port.setText("Port: " + String.valueOf(uri.getPort()));

            return convertView;
        }
    }

    private void showServiceSelected(String url) {
        try {
            ((InstallListener) getActivity()).installFinished(false, url);
        } catch (ClassCastException e) {
            throw new ClassCastException(getActivity().toString() + " must implement InstallListener");
        }
    }


}
