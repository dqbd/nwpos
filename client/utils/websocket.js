const wsUrl = `ws://${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/socket`
const { seller, customer } = require('../../core')
const watch = require('redux-watch')

let conn = null

module.exports.send = (type, payload) => {
  if (conn) conn.send(JSON.stringify({ type, payload }))
}

module.exports.bindWebsocket = (store) => {
  conn = new WebSocket(wsUrl)
  let pinger = setInterval(() => module.exports.send('ping'), 60 * 1000)

  const initValue = !!JSON.parse(window.localStorage.getItem('scanner'))
  store.dispatch(seller.setListenToScanner(initValue))

  store.subscribe(watch(store.getState, 'listenToScanner')((newVal) => {
    window.localStorage.setItem('scanner', `${newVal}`)
  }))

  conn.onmessage = ({ data }) => {
    store.dispatch(seller.socketConnected(true))
    try {
      const { type, payload } = JSON.parse(data)
      console.log(type, payload)
      if (type === 'addItem') {
        const { price, name, ean, global } = payload
        if (!global || store.getState().listenToScanner) {
          store.dispatch(customer.addEan({ price, name, ean }))
        }
      } else if (type === 'scanError') {
        store.dispatch(seller.addToast({ type: 'error', message: 'Čárový kód nenalezen' }))
      }
    } catch (err) {
      console.error(err)
    }
  }

  conn.onclose = () => {
    console.log('conn closed, reconnecting')
    store.dispatch(seller.socketConnected(false))
    clearInterval(pinger)
    setTimeout(() => module.exports.bindWebsocket(store), 1000)
  }

  conn.onerror = (err) => {
    console.log('conn error', err.message)
    conn.close()
  }
}