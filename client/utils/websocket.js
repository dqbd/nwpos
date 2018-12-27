const wsUrl = `ws://${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/socket`
const { screen, customer } = require('../../core')

module.exports.bindWebsocket = (store) => {
  const conn = new WebSocket(wsUrl)
  let pinger = setInterval(() => {
    conn.send(JSON.stringify({
      type: 'ping',
      payload: null,
    }))
  }, 60 * 1000)

  conn.onmessage = ({ data }) => {
    try {
      const { type, payload } = JSON.parse(data)
      console.log(type, payload)
      if (type === 'addItem') {

        if (store.getState().listenToScanner) {
          const { price, name } = payload
          store.dispatch(screen.set(price))
          store.dispatch(customer.add(name))
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