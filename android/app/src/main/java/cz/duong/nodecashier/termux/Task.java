package cz.duong.nodecashier.termux;

import cz.duong.nodecashier.R;

/**
 * @author d^2
 */

public enum Task {
    INSTALL(R.raw.install, null),
    RUN(R.raw.run, null),
    CHECK(R.raw.check, null),
    CLEAR(R.raw.clear, null);

    public int rid;
    public String[] args;
    Task(int rid, String[] args) {
        this.rid = rid;
        this.args = args;
    }

    public Task args(String[] args) {
        this.args = args;
        return this;
    }

    public static Task fromName(String name) {
        for(Task task : values()) {
            if (task.name().equalsIgnoreCase(name)) {
                return task;
            }
        }

        return null;
    }
}
