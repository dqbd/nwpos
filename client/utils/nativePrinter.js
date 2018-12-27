const { services } = require("../../core")

module.exports.bindNativePrinter = (store) => {
  window.nativePrinterStatus = (status) => {
    store.dispatch(services.nativePrinter(status))
  }
}