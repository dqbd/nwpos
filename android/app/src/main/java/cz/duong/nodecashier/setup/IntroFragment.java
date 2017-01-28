package cz.duong.nodecashier.setup;

import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import cz.duong.nodecashier.R;

public class IntroFragment extends Fragment {

    public IntroFragment() {}

    public static IntroFragment newInstance() {
        IntroFragment fragment = new IntroFragment();
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_intro, container, false);

        Button noServer = (Button) view.findViewById(R.id.no_server_btn);

        noServer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showNoServer();
            }
        });

        Button findServer = (Button) view.findViewById(R.id.find_server_btn);

        findServer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showFindServer();
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

    private void showNoServer() {
        try {
            ((IntroListener) getActivity()).introContinue(true);
        } catch (ClassCastException e) {
            throw new ClassCastException(getActivity().toString() + " must implement IntroListener");
        }
    }

    private void showFindServer() {
        try {
            ((IntroListener) getActivity()).introContinue(false);
        } catch (ClassCastException e) {
            throw new ClassCastException(getActivity().toString() + " must implement IntroListener");
        }
    }
}
