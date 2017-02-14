package cz.duong.nodecashier.printer;

/**
 * @author d^2
 */

public class Command {
    private static final byte ESC = 0x1B;
    private static final byte FS = 0x1C;
    private static final byte GS = 0x1D;
    private static final byte US = 0x1F;
    private static final byte DLE = 0x10;
    private static final byte DC4 = 0x14;
    private static final byte DC1 = 0x11;
    private static final byte SP = 0x20;
    private static final byte NL = 0x0A;
    private static final byte FF = 0x0C;
    public static final byte PIECE = (byte) 0xFF;
    public static final byte NUL = (byte) 0x00;

    public static byte[] ESC_Init = new byte[]{ESC, '@'};
    public static byte[] LF = new byte[]{NL};
    public static byte[] ESC_J = new byte[]{ESC, 'J', 0x00};
    public static byte[] ESC_d = new byte[]{ESC, 'd', 0x00};
    public static byte[] US_vt_eot = new byte[]{US, DC1, 0x04};
    public static byte[] ESC_B_m_n = new byte[]{ESC, 'B', 0x00, 0x00};
    public static byte[] GS_V_n = new byte[]{GS, 'V', 0x00};
    public static byte[] GS_V_m_n = new byte[]{GS, 'V', 'B', 0x00};
    public static byte[] GS_i = new byte[]{ESC, 'i'};
    public static byte[] GS_m = new byte[]{ESC, 'm'};
    public static byte[] ESC_SP = new byte[]{ESC, SP, 0x00};
    public static byte[] ESC_ExclamationMark = new byte[]{ESC, '!', 0x00};
    public static byte[] GS_ExclamationMark = new byte[]{GS, '!', 0x00};
    public static byte[] GS_B = new byte[]{GS, 'B', 0x00};
    public static byte[] ESC_V = new byte[]{ESC, 'V', 0x00};
    public static byte[] ESC_M = new byte[]{ESC, 'M', 0x00};
    public static byte[] ESC_G = new byte[]{ESC, 'G', 0x00};
    public static byte[] ESC_E = new byte[]{ESC, 'E', 0x00};
    public static byte[] ESC_LeftBrace = new byte[]{ESC, '{', 0x00};
    public static byte[] ESC_Minus = new byte[]{ESC, 45, 0x00};
    public static byte[] FS_dot = new byte[]{FS, 46};
    public static byte[] FS_and = new byte[]{FS, '&'};
    public static byte[] FS_ExclamationMark = new byte[]{FS, '!', 0x00};
    public static byte[] FS_Minus = new byte[]{FS, 45, 0x00};
    public static byte[] FS_S = new byte[]{FS, 'S', 0x00, 0x00};
    public static byte[] ESC_t = new byte[]{ESC, 't', 0x00};
    public static byte[] ESC_Two = new byte[]{ESC, 50};
    public static byte[] ESC_Three = new byte[]{ESC, 51, 0x00};
    public static byte[] ESC_Align = new byte[]{ESC, 'a', 0x00};
    public static byte[] GS_LeftSp = new byte[]{GS, 'L', 0x00, 0x00};
    public static byte[] ESC_Relative = new byte[]{ESC, '$', 0x00, 0x00};
    public static byte[] ESC_Absolute = new byte[]{ESC, 92, 0x00, 0x00};
    public static byte[] GS_W = new byte[]{GS, 'W', 0x00, 0x00};
    public static byte[] DLE_eot = new byte[]{DLE, 0x04, 0x00};
    public static byte[] DLE_DC4 = new byte[]{DLE, DC4, 0x00, 0x00, 0x00};
    public static byte[] ESC_p = new byte[]{ESC, 'F', 0x00, 0x00, 0x00};
    public static byte[] GS_H = new byte[]{GS, 'H', 0x00};
    public static byte[] GS_h = new byte[]{GS, 'h', (byte) 0xa2};
    public static byte[] GS_w = new byte[]{GS, 'w', 0x00};
    public static byte[] GS_f = new byte[]{GS, 'f', 0x00};
    public static byte[] GS_x = new byte[]{GS, 'x', 0x00};
    public static byte[] GS_k = new byte[]{GS, 'k', 'A', FF};
    public static byte[] GS_k_m_v_r_nL_nH = new byte[]{ESC, 'Z', 0x03, 0x03, 0x08, 0x00, 0x00};
    
    public static byte[] cashbox(int nMode, int nTime1, int nTime2) {
        if ((nMode < 0 || nMode > 1) | nTime1 < 0 | nTime1 > 255 | nTime2 < 0 | nTime2 > 255)
            return null;

        Command.ESC_p[2] = (byte) nMode;
        Command.ESC_p[3] = (byte) nTime1;
        Command.ESC_p[4] = (byte) nTime2;

        return Command.ESC_p;
    }
}
