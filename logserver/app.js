let cons = document.querySelector("#console")
let serverlist = document.querySelector("#servers")
const url = "http://nwpos.duong.cz/index.php"

let selected_server = null
let timer = null


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

            if (selected_server !== server_id) {
                return
            }

            let scrollRoll = (cons.scrollTop + cons.clientHeight == cons.scrollHeight)
            res.data.forEach(row => {
                let el = document.createElement("div")
                el.dataset.timestamp = Date.parse(row.date)

                //validate if any existing with same timestamp
                let same_date = document.querySelectorAll("[data-timestamp='"+el.dataset.timestamp+"']")
                let exists = false
                for (let i = 0; i < same_date.length; i++) {
                    let cont = same_date[i].querySelector(".content").innerHTML
                    let tag = same_date[i].querySelector(".tag").innerHTML
                    if (cont.localeCompare(row.content) == 0 || tag.toLowerCase() == "updater") {
                        exists = true
                        break
                    }
                }
                

                let content = row.content

                try {
                    content = JSON.stringify(JSON.parse(content), null, 4)
                    console.log(content)
                } catch (err) {}

                el.innerHTML = "<span class='date'>" + row.date +"</span>"
                el.innerHTML += "<span class='tag'>" + row.process + "</span>"
                el.innerHTML += "<pre class='content'>" + content + "</pre>"

                if (!exists) {
                    cons.appendChild(el)
                }

                if (scrollRoll) {
                    cons.scrollTop = cons.scrollHeight
                }
            })
            timer = setTimeout(getLogs.bind(this), 2000)
        })
}

function sendAction(action, args = []) {
    if (selected_server === null) return false

    console.log(new Date().getTime())

    fetch(url + "?query=actions&id="+ selected_server, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: action,
            arguments: JSON.stringify(args)
        })
    }).then(a => a.text()).then(a => console.log(a))
}

document.querySelector("#pull").onclick = (e) => {
    e.preventDefault()
    sendAction("pullAndRestart", [prompt("Cíl")])
}

document.querySelector("#restart").onclick = (e) => {
    e.preventDefault()
    sendAction("restart", [prompt("Cíl")])
}

document.querySelector("#list").onclick = (e) => {
    e.preventDefault()
    sendAction("list")
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
            getLogs()
        }

        selected_server = serverlist.querySelectorAll("option")[0].value
        getLogs()
    })
