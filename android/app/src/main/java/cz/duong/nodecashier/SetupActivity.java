package cz.duong.nodecashier;

import android.app.Activity;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.os.Bundle;

import cz.duong.nodecashier.setup.FinishFragment;
import cz.duong.nodecashier.setup.FinishListener;
import cz.duong.nodecashier.setup.InstallFragment;
import cz.duong.nodecashier.setup.InstallListener;
import cz.duong.nodecashier.setup.IntroFragment;
import cz.duong.nodecashier.setup.IntroListener;
import cz.duong.nodecashier.setup.ServiceDetectFragment;
import cz.duong.nodecashier.utils.LauncherUtils;

public class SetupActivity extends Activity implements IntroListener, InstallListener, FinishListener {

    FragmentManager fragmentManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        AppPreferences.setFirstInit(this, true);

        setContentView(com.duong.R.layout.activity_setup);
        fragmentManager = getFragmentManager();

        fragmentManager.beginTransaction()
                .replace(com.duong.R.id.activity_setup, IntroFragment.newInstance())
                .commit();
    }

    @Override
    public void introContinue(boolean noServer) {
        if (noServer) {
            fragmentManager.beginTransaction()
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .replace(com.duong.R.id.activity_setup, InstallFragment.newInstance())
                .commit();
        } else {
            fragmentManager.beginTransaction()
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .replace(com.duong.R.id.activity_setup, ServiceDetectFragment.newInstance())
                .commit();
        }
    }

    @Override
    public void finishInstall() {
        startActivity(LauncherUtils.getHomeIntent(this));
        finish();
    }

    @Override
    public void installFinished(boolean noServer, String url) {
        AppPreferences.setFirstInit(this, false);
        AppPreferences.setRunServer(this, noServer);
        AppPreferences.setServerUrl(this, url);

        fragmentManager.beginTransaction()
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .replace(com.duong.R.id.activity_setup, FinishFragment.newInstance())
                .commit();
    }

    @Override
    public void cancel() {
        fragmentManager.beginTransaction()
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .replace(com.duong.R.id.activity_setup, IntroFragment.newInstance())
                .commit();
    }
}
