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
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;

import cz.duong.nodecashier.R;
import cz.duong.nodecashier.ServiceDialog;
import cz.duong.nodecashier.utils.AppDiscoveryTask;
import cz.duong.nodecashier.utils.UrlChecker;

public class ServiceDetectFragment extends Fragment implements UrlChecker.CheckListener {


    HandlerThread bgThread;
    Handler handler;

    Handler uiHandler;

    AppDiscoveryTask task;

    UrlAdapter adapter;

    View serviceLoading;
    View serviceView;
    View progressView;


    public ServiceDetectFragment() {}

    public static ServiceDetectFragment newInstance() {
        return new ServiceDetectFragment();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_service_detect, container, false);

        serviceLoading = view.findViewById(R.id.service_load);
        serviceView = view.findViewById(R.id.service_view);
        progressView = view.findViewById(R.id.progressBar);

        Button manualBtn = (Button) view.findViewById(R.id.manual_button);
        manualBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ServiceDialog dialog = new ServiceDialog(getContext(), new ServiceDialog.ServiceSetListener() {
                    @Override
                    public void onManualService(String host, String port) {
                        String url = "http://" + host + ":" + port;
                        new UrlChecker(ServiceDetectFragment.this).execute(url);

                        serviceView.setVisibility(View.GONE);
                        progressView.setVisibility(View.VISIBLE);
                    }
                });

                dialog.show();
            }
        });

        ListView listView = (ListView) view.findViewById(R.id.service_list);
        listView.setAdapter(adapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                String url = (String) parent.getItemAtPosition(position);
                new UrlChecker(ServiceDetectFragment.this).execute(url);

                serviceView.setVisibility(View.GONE);
                progressView.setVisibility(View.VISIBLE);
            }
        });

        return view;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        bgThread = new HandlerThread("AppDiscovery");
        bgThread.start();

        handler = new Handler(bgThread.getLooper());
        uiHandler = new Handler(Looper.getMainLooper());

        adapter = new UrlAdapter(getContext());
        task = new AppDiscoveryTask(getActivity(), new AppDiscoveryTask.UrlListener() {
            @Override
            public void onUrlReceived(final String url) {
                uiHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        serviceLoading.setVisibility(View.GONE);
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

        Log.d("APP-DISCOVERY", "detaching: " + String.valueOf(task != null));

        if (task != null) task.stop();
        if (handler != null) handler.removeCallbacksAndMessages(null);
        if (uiHandler != null) uiHandler.removeCallbacksAndMessages(null);
    }

    @Override
    public void onUrlValid(String url, boolean valid) {
        if (valid) {
            showServiceSelected(url);
        } else {
            serviceView.setVisibility(View.VISIBLE);
            progressView.setVisibility(View.GONE);


            Toast.makeText(getActivity(), "Nemohu se připojit k: " + url, Toast.LENGTH_LONG).show();
        }

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
                convertView = LayoutInflater.from(getContext()).inflate(R.layout.server_listitem, parent, false);
            }

            Uri uri = Uri.parse(action);

            TextView name = (TextView) convertView.findViewById(R.id.hostname_text);
            name.setText(uri.getHost());

            TextView port = (TextView) convertView.findViewById(R.id.port_text);
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
