let cons = document.querySelector("#console")
let serverlist = document.querySelector("#servers")
const url = "http://nwpos.duong.cz/index.php"

let selected_server = null
let timer = null

function getTime() {
    let now = new Date()
    return [now.getHours(), now.getMinutes(), now.getSeconds()].map(num => ("0" + num).slice(-2)).join(":")
}

function addLog(tag, content, id = -1, time = getTime()) {
    let scrollRoll = (cons.scrollTop + cons.clientHeight == cons.scrollHeight)
    
    let el = document.createElement("div")
    el.dataset.id = id

    if (id < 0 || cons.querySelectorAll("[data-id='"+id+"']").length == 0) {
        try {
            content = JSON.stringify(JSON.parse(content), null, 4)
        } catch (err) {}

        el.innerHTML = "<span class='date'>" + time +"</span>"
        el.innerHTML += "<span class='tag'>" + tag + "</span>"
        el.innerHTML += "<pre class='content'>" + content + "</pre>"

        cons.appendChild(el)

        if (scrollRoll) {
            cons.scrollTop = cons.scrollHeight
        }
    }
}

function clearLogs() {
    cons.innerHTML = ""
}

function getLogs() {
    let time = Math.floor(new Date().getTime() / 1000) - 10
    let server_id = selected_server

    clearTimeout(timer)

    if (server_id === null) {
        timer = setTimeout(getLogs.bind(this), 1000)
    }

    fetch(url+"?query=log&id="+server_id+"&date="+time)
        .then(a => a.json())
        .then(res => {
            if (selected_server !== server_id) return
            res.data.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
            .forEach(row => {
                addLog(row.process, row.content, Number.parseInt(row.id), row.date.substring(11))
            })
            timer = setTimeout(getLogs.bind(this), 2000)
        })
}

function sendAction(action, args = []) {
    if (selected_server === null) return false

    addLog("ACTION", `Sending action: ${action} (${args})`)

    fetch(url + "?query=actions&id="+ selected_server, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: action,
            arguments: JSON.stringify(args)
        })
    }).then(a => a.text()).then(a => console.log(a))
}

document.querySelector("#pull").onclick = (e) => sendAction("pullAndRestart", [prompt("Cíl")])
document.querySelector("#restart").onclick = (e) => sendAction("restart", [prompt("Cíl")])
document.querySelector("#list").onclick = (e) => sendAction("list")
document.querySelector("#clear").onclick = (e) => clearLogs()
document.querySelector("#nickname").onclick = (e) => {
    if (selected_server) {
        let nickname = prompt("Přezdívka pro server " + selected_server)
        if (!nickname) nickname = ""
    }
}
document.querySelector("#cmd").onclick = (e) => {
    let cmd = prompt("Zadat příkaz")

    if (cmd) {
        let args = cmd.split(" ")
        let name = args.pop()
        sendAction(name, args)
    }
}

fetch(url + "?query=clients")
    .then(a => a.json())
    .then(res => {
        res.data.forEach(server => {
            let el = document.createElement("option")
            el.innerText = server.server_id
            el.value = server.server_id

            serverlist.appendChild(el)
        })

        serverlist.onchange = (e) => {
            selected_server = e.target.value
            clearLogs()
            getLogs()

            addLog("APP", `Showing ${selected_server}`)
        }

        serverlist.onchange({target: serverlist.querySelectorAll("option")[0]})
    })
