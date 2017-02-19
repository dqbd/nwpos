package cz.duong.nodecashier.setup;

import android.app.Fragment;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.os.Bundle;

import java.util.Set;

/**
 * @author d^2
 */

public class BluetoothFragment extends Fragment {

    BluetoothAdapter bluetoothAdapter;

    public static BluetoothFragment newInstance() {
        return new BluetoothFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter == null) {
            return;
            //TODO: printer not detected
        }

        Set<BluetoothDevice> bonded = bluetoothAdapter.getBondedDevices();

        if (bonded.size() > 0) {

        }

//        getActivity().registerReceiver()
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        if (bluetoothAdapter != null) {
            bluetoothAdapter.cancelDiscovery();
        }
    }
}
