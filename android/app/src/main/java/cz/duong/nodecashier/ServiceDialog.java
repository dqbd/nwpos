package cz.duong.nodecashier;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;

/**
 * @author d^2
 */

public class ServiceDialog extends Dialog {

    private ServiceSetListener callback;

    public ServiceDialog(Context context, ServiceSetListener callback) {
        super(context);
        this.callback = callback;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.service_dialog);

        final EditText ip = (EditText) findViewById(R.id.ip_service);
        final EditText port = (EditText) findViewById(R.id.port_service);

        Button submit = (Button) findViewById(R.id.service_submit);

        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (callback != null) {
                    callback.onManualService(ip.getText().toString(), port.getText().toString());
                    dismiss();
                }
            }
        });
    }

    public interface ServiceSetListener {
        void onManualService(String host, String port);
    }
}
