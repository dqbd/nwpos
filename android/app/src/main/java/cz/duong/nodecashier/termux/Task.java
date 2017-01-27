package cz.duong.nodecashier.termux;

/**
 * @author d^2
 */

public enum Task {
    INSTALL(com.duong.R.raw.install, new String[]{}),
    RUN(com.duong.R.raw.run, null),
    CHECK(com.duong.R.raw.check, null);

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
