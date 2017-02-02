import React, { Component } from "react"
import Intro from "./Intro.jsx"
import Detect from "./Detect.jsx"
import Done from "./Done.jsx"
import Install from "./Install.jsx"

const INTRO = "step_intro"
const INSTALL = "step_install"
const DETECT = "step_detect"
const DONE = "step_finish"

const {ipcRenderer: ipc} = electronRequire("electron")

class Setup extends Component {

	constructor(props) {
		super(props)
		this.state = { screen: INTRO, servers: [] }
	}

	componentDidMount() {
		ipc.on("service_detect", (event, service) => {
			let ips = service.addresses.filter(ip => ip.indexOf(":") == -1).filter(ip => {
				return this.state.servers.find(server => server.ip === ip && server.port === service.port) === undefined
			}).map(ip => {
				return {
					ip: ip,
					port: service.port
				}
			})

			this.setState({servers: [...this.state.servers, ...ips]})
		})

		ipc.on("ping", (event, data) => {
			console.log("pong")
		})
	}

	installListener() {
		let self = this

		return {
			installFinished: (noServer, url) => {
				console.log(noServer, url)
				if (window.localStorage) {
					console.log("local storage is enabled", noServer, url)
					if (noServer) {
						url = "http://localhost:8080"
					}

					window.localStorage.setItem("url", url)
				}
				self.setState({ screen: FINISH })
			},
			cáncel: () => {
				self.setState({ screen: INTRO })
			}
		}
	}

	introListener() {
		let self = this

		return {
			introContinue: (noServer) => {
				self.setState({screen: ((noServer) ? INSTALL : DETECT)})
			}
		}
	}

	render() {
		let content = null
		switch(this.state.screen) {
			case INSTALL: content = <Install listener={this.introListener()} />; break
			case DETECT: content = <Detect servers={this.state.servers} listener={this.installListener()} />; break
			case INTRO: content = <Intro listener={this.introListener()} />; break
			case DONE: content = <Done listener={this.introListener()} />; break
		}

		return <div className="setup">{content}</div>
	}
}

export default Setup