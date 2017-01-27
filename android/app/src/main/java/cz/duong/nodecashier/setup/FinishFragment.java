package cz.duong.nodecashier.setup;

import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import com.duong.R;

public class FinishFragment extends Fragment {

    public FinishFragment() {}

    public static FinishFragment newInstance() {
        FinishFragment fragment = new FinishFragment();
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_finish, container, false);

        Button finish = (Button) view.findViewById(R.id.finish_btn);

        finish.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finishInstall();
            }
        });


        return view;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

    }

    @Override
    public void onDetach() {
        super.onDetach();

    }

    private void finishInstall() {
        try {
            ((FinishListener) getActivity()).finishInstall();
        } catch (ClassCastException e) {
            throw new ClassCastException(getActivity().toString() + " must implement FinishListener");
        }
    }
}
