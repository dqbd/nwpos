const { seller } = require("../../core")

module.exports.bindNativePrinter = (store) => {
  window.nativePrinterStatus = (status) => {
    store.dispatch(seller.setNativePrinter(status))
  }
}