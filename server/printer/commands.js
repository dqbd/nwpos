/**
 * ESC/POS _ (Constants)
 */
var _ = {
  LF  : '\x0a',
  FS  : '\x1c',
  FF  : '\x0c',
  GS  : '\x1d',
  DLE : '\x10',
  EOT : '\x04',
  NUL : '\x00',
  ESC : '\x1b',
  EOL : '\n'
};


/**
 * [FEED_CONTROL_SEQUENCES Feed control sequences]
 * @type {Object}
 */
_.FEED_CONTROL_SEQUENCES = {
  CTL_LF  : '\x0a',   // Print and line feed
  CTL_FF  : '\x0c',   // Form feed
  CTL_CR  : '\x0d',   // Carriage return
  CTL_HT  : '\x09',   // Horizontal tab
  CTL_VT  : '\x0b',   // Vertical tab
};

_.LINE_SPACING = {
  LS_DEFAULT : '\x1b\x32',
  LS_SET     : '\x1b\x33'
};

/**
 * [CASH_DRAWER Cash Drawer]
 * @type {Object}
 */
_.CASH_DRAWER = {
  CD_KICK_2 : '\x1b\x70\x00\x36\x36'      , // Sends a pulse to pin 2 []
  CD_KICK_5 : '\x1b\x70\x01\x36\x36'      , // Sends a pulse to pin 5 []
};

/**
 * [PAPER Paper]
 * @type {Object}
 */
_.PAPER = {
  PAPER_FULL_CUT  : '\x1d\x56\x00' , // Full cut paper
  PAPER_PART_CUT  : '\x1d\x56\x01' , // Partial cut paper
  PAPER_CUT_A     : '\x1d\x56\x41' , // Partial cut paper
  PAPER_CUT_B     : '\x1d\x56\x42' , // Partial cut paper
};

/**
 * [TEXT_FORMAT Text format]
 * @type {Object}
 */
_.TEXT_FORMAT = {
  TXT_NORMAL      : '\x1b\x21\x00', // Normal text
  TXT_2HEIGHT     : '\x1b\x21\x10', // Double height text
  TXT_2WIDTH      : '\x1b\x21\x20', // Double width text

  TXT_UNDERL_OFF  : '\x1b\x2d\x00', // Underline font OFF
  TXT_UNDERL_ON   : '\x1b\x2d\x01', // Underline font 1-dot ON
  TXT_UNDERL2_ON  : '\x1b\x2d\x02', // Underline font 2-dot ON
  TXT_BOLD_OFF    : '\x1b\x45\x00', // Bold font OFF
  TXT_BOLD_ON     : '\x1b\x45\x01', // Bold font ON

  TXT_FONT_A      : '\x1b\x4d\x00', // Font type A
  TXT_FONT_B      : '\x1b\x4d\x01', // Font type B
  TXT_FONT_C      : '\x1b\x4d\x02', // Font type C

  TXT_ALIGN_LT    : '\x1b\x61\x00', // Left justification
  TXT_ALIGN_CT    : '\x1b\x61\x01', // Centering
  TXT_ALIGN_RT    : '\x1b\x61\x02', // Right justification
};

_.CODEPAGE = {
  DEFAULT         : '\x1b\x74\x00',
  OEM852          : '\x1b\x74\x36',
  WPC1250         : '\x1b\x74\x48'
}

_.FONT = {
  DEFAULT         : '\x1b\x4d\x00',
  SMALL           : '\x1b\x4d\x01' 
}

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = _;
