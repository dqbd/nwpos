package cz.duong.nodecashier;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.SoundEffectConstants;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author d^2
 */

class AppInterface {
    private WebView view;
    private AppLoadListener listener;

    AppInterface(WebView view, AppLoadListener listener) {
        this.view = view;
        this.listener = listener;
    }

    @JavascriptInterface
    public void buttonClick() {
        if (view != null) {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    view.playSoundEffect(SoundEffectConstants.CLICK);
                }
            });

        }
    }

    @JavascriptInterface
    public void loadFinished(String json) {
        if (listener != null) {

            final LinkedHashMap<String, String> actionMap = new LinkedHashMap<>();

            try {
                JSONObject map = new JSONObject(json);
                JSONArray actions = map.getJSONArray("actions");
                for (int i = 0; i < actions.length(); i++) {
                    JSONObject action = actions.getJSONObject(i);
                    actionMap.put(action.getString("name"), action.getString("func"));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }

            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    listener.onAppLoaded(actionMap);
                }
            });
        }
    }

    interface AppLoadListener {
        void onAppLoaded(Map<String, String> actions);
    }
}
