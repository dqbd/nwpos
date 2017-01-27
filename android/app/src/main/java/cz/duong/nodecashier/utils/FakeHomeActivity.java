package cz.duong.nodecashier.utils;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ResolveInfo;
import android.os.Bundle;

import com.duong.BuildConfig;

/**
 * @author d^2
 */

public class FakeHomeActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(com.duong.R.layout.activity_fake_home);
    }

    public static boolean isLauncher(final Context context) {
        final Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);
        final ResolveInfo res = context.getPackageManager().resolveActivity(intent, 0);
        return res.activityInfo != null &&
                !"android".equals(res.activityInfo.packageName) &&
                res.activityInfo.packageName.equals(BuildConfig.APPLICATION_ID);
    }
}
