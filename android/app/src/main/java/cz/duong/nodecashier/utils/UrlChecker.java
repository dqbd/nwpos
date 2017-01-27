package cz.duong.nodecashier.utils;

import android.os.AsyncTask;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.SocketException;
import java.net.URL;

/**
 * @author d^2
 */

public class UrlChecker extends AsyncTask<String, Void, Boolean> {

    CheckListener listener;
    String url;

    public UrlChecker(CheckListener listener) {
        this.listener = listener;
    }

    @Override
    protected Boolean doInBackground(String... params) {
        url = params[0];
        try {
            URL param = new URL(url);

            HttpURLConnection connection = (HttpURLConnection) param.openConnection();
            connection.setConnectTimeout(30000);
            connection.setReadTimeout(15000);

            connection.setRequestMethod("GET");
            connection.connect();

            return connection.getResponseCode() == HttpURLConnection.HTTP_OK;

        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid url");
        } catch (SocketException e) {
            return false;
        } catch (IOException e) {
            return false;
        }
    }

    @Override
    protected void onPostExecute(Boolean aBoolean) {
        super.onPostExecute(aBoolean);
        if (listener != null) listener.onUrlValid(url, aBoolean);
    }

    public interface CheckListener {
        void onUrlValid(String url, boolean valid);
    }
}
