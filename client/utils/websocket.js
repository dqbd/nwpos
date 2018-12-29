const wsUrl = `ws://${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/socket`
const { seller, customer } = require('../../core')
const watch = require('redux-watch')

module.exports.bindWebsocket = (store) => {
  const conn = new WebSocket(wsUrl)
  let pinger = setInterval(() => {
    conn.send(JSON.stringify({
      type: 'ping',
      payload: null,
    }))
  }, 60 * 1000)

  const initValue = !!JSON.parse(window.localStorage.getItem('scanner'))
  store.dispatch(seller.setListenToScanner(initValue))

  store.subscribe(watch(store.getState, 'listenToScanner')((newVal) => {
    window.localStorage.setItem('scanner', `${newVal}`)
  }))

  conn.onmessage = ({ data }) => {
    try {
      const { type, payload } = JSON.parse(data)
      console.log(type, payload)
      if (type === 'addItem') {

        if (store.getState().listenToScanner) {
          const { price, name, ean } = payload
          store.dispatch(customer.addEan({ price, name, ean }))
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  conn.onclose = () => {
    console.log('conn closed, reconnecting')
    clearInterval(pinger)
    setTimeout(() => module.exports.bindWebsocket(store), 1000)
  }

  conn.onerror = (err) => {
    console.log('conn error', err.message)
    conn.close()
  }
}