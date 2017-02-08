package cz.duong.nodecashier.setup;

import android.app.Fragment;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;

import cz.duong.nodecashier.CredDialog;
import cz.duong.nodecashier.R;
import cz.duong.nodecashier.termux.Task;
import cz.duong.nodecashier.termux.TermuxInstaller;
import cz.duong.nodecashier.termux.TermuxService;

import cz.duong.nodecashier.termux.EmulatorDebug;

/**
 * @author d^2
 */

public class InstallFragment extends Fragment implements ServiceConnection {
    private TermuxService mTermService;
    private boolean mIsVisible;

    private Handler uiHandler;

    private View progressBar;
    private View errorView;

    final TermuxInstaller.InstallListener mInstallListener = new TermuxInstaller.InstallListener() {
        @Override
        public void onSuccess() {
            runScript(Task.CLEAR);
        }

        @Override
        public void onInstall() {
//            if (progress == null) {
//                progress = ProgressDialog.show(getActivity(), null, getString(R.string.bootstrap_installer_body), true, false);
//            }
        }

        @Override
        public void onFailed(Throwable e) {
            try {
//                if (progress != null) progress.dismiss(); progress = null;
                progressBar.setVisibility(View.GONE);
                errorView.setVisibility(View.VISIBLE);
            } catch (WindowManager.BadTokenException ignored) {}
        }
    };

    final TermuxService.TaskListener mTaskListener = new TermuxService.TaskListener() {
        @Override
        public void onStarted(String name) {
            if (!mIsVisible) return;
            Task task = Task.fromName(name);

            if (task == Task.RUN) {
                Log.d(EmulatorDebug.LOG_TAG, "Server is running");
            }
        }

        @Override
        public void onStopped(String name, final int exitCode) {
            if (!mIsVisible) return;
            Task task = Task.fromName(name);
            if (task == Task.INSTALL || task == Task.CLEAR) {
                runScript(Task.CHECK);
            } else if (task == Task.CHECK) {

                uiHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        if (exitCode == 42) {
                            CredDialog dialog = new CredDialog(getActivity(), new CredDialog.CredInterface() {
                                @Override
                                public void onGithubCred(String username, String password) {
                                    runScript(Task.INSTALL.args(new String[]{username, password}));
                                }
                            });

                            dialog.show();
                        } else {
                            onInstallFinished();
                        }
                    }
                });
            }
        }
    };

    public InstallFragment() {}

    public static InstallFragment newInstance() {
        return new InstallFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        uiHandler = new Handler(Looper.getMainLooper());
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_install, container, false);

        progressBar = view.findViewById(R.id.progressBar);
        errorView = view.findViewById(R.id.main_error);

        Button cancelBtn = (Button) view.findViewById(R.id.cancel_btn);
        cancelBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onCancel();
            }
        });

        Button retryBtn = (Button) view.findViewById(R.id.retry_btn);
        retryBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setup();
            }
        });

        return view;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        mIsVisible = true;

        Intent serviceIntent = new Intent(getContext(), TermuxService.class);
        // Start the service and make it run regardless of who is bound to it:
        getContext().startService(serviceIntent);
        if (!getContext().bindService(serviceIntent, this, 0))
            throw new RuntimeException("bindService() failed");
    }

    @Override
    public void onDetach() {
        getContext().unbindService(this);
        mIsVisible = false;

        if (uiHandler != null) uiHandler.removeCallbacksAndMessages(null);

        super.onDetach();
    }

    void runScript(Task task) {
        TermuxService.runScript(task, getContext(), this);
    }

    void setup() {
        progressBar.setVisibility(View.VISIBLE);
        errorView.setVisibility(View.GONE);
        TermuxInstaller.setupIfNeeded(getActivity(), mInstallListener);
    }

    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {
        mTermService = ((TermuxService.LocalBinder) service).service;
        mTermService.mListener = mTaskListener;
        setup();
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
        mTermService = null;
    }

    private void onInstallFinished() {
        try {
            ((InstallListener) getActivity()).installFinished(true, "http://localhost:8080");
        } catch (ClassCastException e) {
            throw new ClassCastException(getActivity().toString() + " must implement InstallListener");
        }
    }

    private void onCancel() {
        try {
            ((InstallListener) getActivity()).cancel();
        } catch (ClassCastException e) {
            throw new ClassCastException(getActivity().toString() + " must implement InstallListener");
        }
    }


}
