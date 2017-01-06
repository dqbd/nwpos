package cz.duong.nodecashier;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

/**
 * @author d^2
 */

class ExitDialog extends Dialog {

    private ExitInterface callback;

    private static final String TO_REGISTER = "Přejít k pokladně";
    private static final String TO_STATS = "Zobrazit statistiky";
    private static final String TO_RELOAD = "Znovu načíst";
    private static final String TO_NIGHT = "Přepnout tmavý režim";
    private static final String TO_EXIT = "Odejít z aplikace";

    ExitDialog(Context context, ExitInterface callback) {
        super(context);
        this.callback = callback;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.exit_dialog);

        ListView listView = (ListView) findViewById(R.id.exit_listview);
        final List<String> actions = new ArrayList<String>(){{
            this.add(TO_REGISTER);
            this.add(TO_STATS);
            this.add(TO_NIGHT);
            this.add(TO_RELOAD);
            this.add(TO_EXIT);
        }};

        listView.setAdapter(new ExitActionsAdapter(this.getContext(), actions));

        listView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
                if (actions.get(position).equals(TO_RELOAD)) {
                    callback.onRediscover();
                    dismiss();
                    return true;
                }

                return false;
            }
        });
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                String action = actions.get(position);

                switch (action) {
                    case TO_REGISTER:
                        callback.onShowRegister();
                        break;
                    case TO_EXIT:
                        callback.onExit();
                        break;
                    case TO_RELOAD:
                        callback.onReload();
                        break;
                    case TO_STATS:
                        callback.onShowStats();
                        break;
                    case TO_NIGHT:
                        callback.onNightToggle();
                        break;
                }

                dismiss();
            }
        });
    }

    interface ExitInterface {
        void onShowStats();
        void onShowRegister();
        void onExit();
        void onReload();
        void onRediscover();
        void onNightToggle();
    }
}
