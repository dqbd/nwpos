package cz.duong.nodecashier.setup;

/**
 * @author d^2
 */

public interface InstallListener {
    void installFinished(boolean noServer, String url);
    void cancel();
}
