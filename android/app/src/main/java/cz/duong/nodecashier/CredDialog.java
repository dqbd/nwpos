package cz.duong.nodecashier;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author d^2
 */

public class CredDialog extends Dialog {

    private CredInterface callback;

    public CredDialog(Context context, CredInterface callback) {
        super(context);
        this.callback = callback;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.cred_dialog);

        final EditText name = (EditText) findViewById(R.id.username_login);
        final EditText pass = (EditText) findViewById(R.id.password_login);

        Button submit = (Button) findViewById(R.id.cred_submit);

        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (callback != null) {
                    callback.onGithubCred(name.getText().toString(), pass.getText().toString());
                    dismiss();
                }
            }
        });
    }

    public interface CredInterface {
        void onGithubCred(String username, String password);
    }

}
