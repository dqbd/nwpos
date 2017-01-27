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
import android.widget.ListView;
import android.widget.TextView;

import com.duong.R;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author d^2
 */

class ExitDialog extends Dialog {

    private ExitInterface callback;

    private static final String TO_RELOAD = "Znovu načíst";
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
            this.addAll(callback.getActions().keySet());
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
                    case TO_EXIT:
                        callback.onExit();
                        break;
                    case TO_RELOAD:
                        callback.onReload();
                        break;
                    default:
                        callback.onJavascriptFunction(callback.getActions().get(action));
                        break;
                }

                dismiss();
            }
        });
    }

    interface ExitInterface {
        void onJavascriptFunction(String function);
        void onExit();
        void onReload();
        void onRediscover();

        Map<String, String> getActions();
    }

    private class ExitActionsAdapter extends ArrayAdapter<String> {
        ExitActionsAdapter(Context context, List<String> actions) {
            super(context, 0, actions);
        }

        @Override
        @NotNull
        public View getView(int position, View convertView, @NotNull ViewGroup parent) {
            String action = getItem(position);

            if (convertView == null) {
                convertView = LayoutInflater.from(getContext()).inflate(R.layout.exit_listitem, parent, false);
            }

            TextView name = (TextView) convertView.findViewById(R.id.exit_text);
            name.setText(action);

            return convertView;
        }
    }

}
