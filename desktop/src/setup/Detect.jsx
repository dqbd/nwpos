import React from "react"
import Step from "./step.jsx"

class Detect extends Step {

	getTitle() {
		return "Hledání serverů"
	}

	getDescription() {
		return "Zjišťuji servery běžící na lokální síti"
	}

	getImage() {
		return <svg className="circular" viewBox="25 25 50 50">
			<circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"/>
		</svg>
	}

	getContent() {
		return <div className="list">
			{this.props.servers.map(item => 
				<div className="server" onClick={() => this.props.listener.installFinished(false, "http://" + item.ip + ":"+item.port)}>
					<div className="ip">{item.ip}</div>
					<div className="port">{"Port: " + item.port}</div>
				</div>
			)}
		</div>
	}

	getClasses() {
		return this.props.servers.length > 0 ? [] : ["loading"]
	}
}

export default Detect