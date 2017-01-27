package cz.duong.nodecashier;

import android.content.Context;
import android.preference.PreferenceManager;

/**
 * @author d^2
 */

public class AppPreferences {
    public static final String FIRST_INIT = "cz.duong.FIRST_INIT";
    public static final String SERVER_URL = "cz.duong.SERVER_URL";
    public static final String RUN_SERVER = "cz.duong.RUN_SERVER";

    public static boolean shouldFirstInit(Context context) {
        return PreferenceManager.getDefaultSharedPreferences(context).getBoolean(FIRST_INIT, true);
    }

    public static void setFirstInit(Context context, boolean firstInit) {
        PreferenceManager.getDefaultSharedPreferences(context).edit().putBoolean(FIRST_INIT, firstInit).apply();
    }

    public static boolean shouldRunServer(Context context) {
        return PreferenceManager.getDefaultSharedPreferences(context).getBoolean(RUN_SERVER, false);
    }

    public static void setRunServer(Context context, boolean runServer) {
        PreferenceManager.getDefaultSharedPreferences(context).edit().putBoolean(RUN_SERVER, runServer).apply();
    }

    public static String getServerUrl(Context context) {
        return PreferenceManager.getDefaultSharedPreferences(context).getString(SERVER_URL, null);
    }

    public static void setServerUrl(Context context, String serverUrl) {
        PreferenceManager.getDefaultSharedPreferences(context).edit().putString(SERVER_URL, serverUrl).apply();
    }
}
