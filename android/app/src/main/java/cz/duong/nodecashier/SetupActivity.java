package cz.duong.nodecashier;

import android.app.Activity;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.os.Bundle;

import cz.duong.nodecashier.setup.BluetoothFragment;
import cz.duong.nodecashier.setup.BluetoothListener;
import cz.duong.nodecashier.setup.FinishFragment;
import cz.duong.nodecashier.setup.FinishListener;
import cz.duong.nodecashier.setup.InstallFragment;
import cz.duong.nodecashier.setup.InstallListener;
import cz.duong.nodecashier.setup.IntroFragment;
import cz.duong.nodecashier.setup.IntroListener;
import cz.duong.nodecashier.setup.ServiceDetectFragment;
import cz.duong.nodecashier.utils.LauncherUtils;

public class SetupActivity extends Activity implements IntroListener, InstallListener, FinishListener, BluetoothListener {

    FragmentManager fragmentManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        AppPreferences.setFirstInit(this, true);

        setContentView(R.layout.activity_setup);
        fragmentManager = getFragmentManager();

        fragmentManager.beginTransaction()
                .replace(R.id.activity_setup, IntroFragment.newInstance())
                .commit();
    }

    @Override
    public void introContinue(boolean noServer) {
        if (noServer) {
            fragmentManager.beginTransaction()
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .replace(R.id.activity_setup, InstallFragment.newInstance())
                .commit();
        } else {
            fragmentManager.beginTransaction()
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .replace(R.id.activity_setup, ServiceDetectFragment.newInstance())
                .commit();
        }
    }

    @Override
    public void finishInstall() {
        startActivity(LauncherUtils.getHomeIntent(this));
        finish();
    }

    @Override
    public void installFinished(boolean noServer, String url, boolean printer) {

        AppPreferences.setRunServer(this, noServer);
        AppPreferences.setServerUrl(this, url);

        if (printer) {
            fragmentManager.beginTransaction()
                    .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                    .replace(R.id.activity_setup, BluetoothFragment.newInstance())
                    .commit();
        } else {
            AppPreferences.setFirstInit(this, false);
            fragmentManager.beginTransaction()
                    .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                    .replace(R.id.activity_setup, FinishFragment.newInstance())
                    .commit();
        }
    }

    @Override
    public void cancel() {
        fragmentManager.beginTransaction()
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .replace(R.id.activity_setup, IntroFragment.newInstance())
                .commit();
    }

    @Override
    public void printerFinished(boolean isPrinter, String address) {
        AppPreferences.setBtAddress(this, isPrinter ? address : null);
        AppPreferences.setFirstInit(this, false);
        fragmentManager.beginTransaction()
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .replace(R.id.activity_setup, FinishFragment.newInstance())
                .commit();
    }
}
