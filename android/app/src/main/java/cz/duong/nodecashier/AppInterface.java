package cz.duong.nodecashier;

import android.os.Handler;
import android.os.Looper;
import android.view.SoundEffectConstants;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

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
    public void loadFinished() {
        if (listener != null) {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    listener.onAppLoaded();
                }
            });
        }
    }

    interface AppLoadListener {
        void onAppLoaded();
    }
}
