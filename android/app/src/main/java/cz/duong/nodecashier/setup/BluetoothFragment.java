package cz.duong.nodecashier.setup;

import android.app.Activity;
import android.app.Fragment;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
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
import java.util.Set;

import cz.duong.nodecashier.R;

/**
 * @author d^2
 */

public class BluetoothFragment extends Fragment {

    DeviceAdapter adapter;
    BluetoothAdapter bluetoothAdapter;

    static final int REQUEST_ENABLE_BT = 1;

    View progressBar;
    Button rescanBtn;

    public static BluetoothFragment newInstance() {
        return new BluetoothFragment();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_bluetooth, container, false);

        ListView deviceList = (ListView) view.findViewById(R.id.bt_list);
        deviceList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {

            }
        });
        deviceList.setAdapter(adapter);
        progressBar = view.findViewById(R.id.bt_load);
        rescanBtn = (Button) view.findViewById(R.id.manual_button);
        rescanBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                discovery();
            }
        });

        getActivity().registerReceiver(mReceiver, new IntentFilter(BluetoothDevice.ACTION_FOUND));
        getActivity().registerReceiver(mReceiver, new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_STARTED));
        getActivity().registerReceiver(mReceiver, new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_FINISHED));

        return view;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        adapter = new DeviceAdapter(getContext());


    }

    @Override
    public void onResume() {
        super.onResume();

        if (bluetoothAdapter != null) {
            if (!bluetoothAdapter.isEnabled()) {
                Intent enableIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                startActivityForResult(enableIntent, REQUEST_ENABLE_BT);
            } else {
                discovery();
            }
        } else {
            Toast.makeText(getContext(), "Bluetooth not in device", Toast.LENGTH_LONG).show();
        }
    }

    void discovery() {
        if (progressBar != null) {
            progressBar.setVisibility(View.VISIBLE);
        }

        if (adapter != null && bluetoothAdapter != null) {
            adapter.clear();

            Set<BluetoothDevice> bonded = bluetoothAdapter.getBondedDevices();
            if (bonded.size() > 0) {
                adapter.addAll(bonded);
                progressBar.setVisibility(View.GONE);
            }

            if (bluetoothAdapter.isDiscovering()) {
                bluetoothAdapter.cancelDiscovery();
            }

            bluetoothAdapter.startDiscovery();
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case REQUEST_ENABLE_BT: {
                if (resultCode == Activity.RESULT_OK) {
                    discovery();
                } else {
                    Toast.makeText(getContext(), "Bluetooth not enabled", Toast.LENGTH_LONG).show();
                }
            }
        }
    }

    @Override
    public void onPause() {
        super.onPause();

        if (bluetoothAdapter != null) {
            progressBar.setVisibility(View.GONE);
            bluetoothAdapter.cancelDiscovery();
        }

    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        if (bluetoothAdapter != null) {
            bluetoothAdapter.cancelDiscovery();
        }

        if (getActivity() != null) {
            getActivity().unregisterReceiver(mReceiver);
        }
    }

    private final BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();

            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if (device.getBondState() != BluetoothDevice.BOND_BONDED) {
                    adapter.add(device);
                    progressBar.setVisibility(View.GONE);
                }
            } else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)) {
                if (rescanBtn != null) {
                    rescanBtn.setText("Znovu vyhledávat");
                    rescanBtn.setEnabled(true);
                }

            } else if (BluetoothAdapter.ACTION_DISCOVERY_STARTED.equals(action)) {
                if (rescanBtn != null) {
                    rescanBtn.setText("Vyhledávám...");
                    rescanBtn.setEnabled(false);
                }

            }
        }
    };

    private static class DeviceAdapter extends ArrayAdapter<BluetoothDevice> {

        public DeviceAdapter(Context context) {
            super(context, 0, new ArrayList<BluetoothDevice>());
        }

        @Override
        @NotNull
        public View getView(int position, View convertView, @NotNull ViewGroup parent) {
            if (convertView == null) {
                convertView = LayoutInflater.from(getContext()).inflate(R.layout.bluetooth_listitem, parent, false);
            }

            BluetoothDevice device = getItem(position);

            TextView name = (TextView) convertView.findViewById(R.id.bt_name_text);
            TextView address = (TextView) convertView.findViewById(R.id.bt_address_text);

            if (device != null && device.getName() != null) {
                name.setText(device.getName());
            }

            if (device != null && device.getAddress() != null) {
                address.setText(device.getAddress());
            }

            return convertView;
        }
    }


}
