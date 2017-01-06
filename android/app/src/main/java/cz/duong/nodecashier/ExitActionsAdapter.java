package cz.duong.nodecashier;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

/**
 * @author d^2
 */

class ExitActionsAdapter extends ArrayAdapter<String> {
    ExitActionsAdapter(Context context, List<String> actions) {
        super(context, 0, actions);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        String action = getItem(position);

        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.exit_listitem, parent, false);
        }

        TextView name = (TextView) convertView.findViewById(R.id.exit_text);
        name.setText(action);

        return convertView;
    }
}
