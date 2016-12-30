'use strict';
const iconv        = require('iconv-lite');
const Buffer       = require('mutable-buffer');
const _            = require('./commands');

/**
 * [function ESC/POS Printer]
 * @param  {[Adapter]} adapter [eg: usb, network, or serialport]
 * @return {[Printer]} printer  [the escpos printer instance]
 */
function Printer(adapter){
	if (!(this instanceof Printer)) {
		return new Printer(adapter);
	}
	var self = this;
	this.adapter = adapter;
	this.buffer = new Buffer();
};

/**
 * Send data to hardware and flush buffer
 * @param  {Function} callback
 * @return printer instance
 */
Printer.prototype.flush = function(callback){
	var buf = this.buffer.flush();
	this.adapter.write(buf, callback);
	return this;
};
/**
 * [function print]
 * @param  {[String]}  content  [description]
 * @param  {[String]}  encoding [description]
 * @return printer instance
 */
Printer.prototype.print = function(content){
	this.buffer.write(content);
	return this;
};
/**
 * [function println]
 * @param  {[String]}  content  [description]
 * @param  {[String]}  encoding [description]
 * @return printer instance
 */
Printer.prototype.println = function(content){
	return this.print([ content, _.EOL ].join(''));
};

/**
 * [function Print alpha-numeric text]
 * @param  {[String]}  content  [description]
 * @param  {[String]}  encoding [description]
 * @return printer instance
 */
Printer.prototype.text = function(content, encoding){
	return this.print(iconv.encode(content + _.EOL, "CP1250"));
};

/**
 * [line feed]
 * @param  {[type]}    lines   [description]
 * @return {[Printer]} printer [description]
 */
Printer.prototype.feed = function (n = 3) {
	this.buffer.write(new Array(n || 1).fill(_.EOL).join(''));
	return this.flush();
};

/**
 * [function Send pulse to kick the cash drawer]
 * @param  {[type]} pin [description]
 * @return printer instance
 */
Printer.prototype.cashdraw = function(pin){
	this.buffer.write(_.CASH_DRAWER[
		'CD_KICK_' + (pin || 2)
	]);
	return this.flush();
};

/**
 * [close description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Printer.prototype.close = function(callback){
	var self = this;
	return this.flush(function(){
		console.log("flushing")
		self.adapter.close(callback);
	});
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = Printer;
