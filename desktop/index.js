const {app, ipcMain, BrowserWindow} = require('electron')

const path = require('path')
const url = require('url')

const bonjour = require("bonjour")()

class App {

	constructor(send) {
		this.send = send

		
	}

	discover(stop = false) {
		bonjour.find({ type: "http" }, (service) => {
			this.send("discover", service)			
		})
	}

	install() {
		this.send("")
	}

	verify() {

	}
}

let mainWindow

function createWindow () {
	mainWindow = new BrowserWindow({width: 800, height: 600, show: false})

	function send(name, data) {
		if (mainWindow !== null) {
			mainWindow.webContents.send(name, data)
		}
	}

	mainWindow.loadURL("http://localhost:8080/")
	mainWindow.webContents.openDevTools()

	mainWindow.on('closed', function () {
		mainWindow = null
	})

	mainWindow.once("ready-to-show", () => {
		mainWindow.show()
		

		setInterval(() => {
			send("ping", new Date().getTime())
		}, 1000)
	})

	
}


app.on('ready', createWindow)
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
})
