import React from "react"
import Step from "./step.jsx"

class Install extends Step {
	constructor(props) {
		super(props)
		this.state = {failed: false}
	}


	getTitle() {
		return !this.state.failed ? "Instaluji server" : "Instalace selhala"
	}

	getDescription() {
		return !this.state.failed ? "Stahujeme a nastavujeme vše potřebné!" : "Došlo k chybě při instalaci, je internet k dispozici?"
	}

	getClasses() {
		return !this.state.failed ? [] : ["error"]
	}

	getImage() {
		if (!this.state.failed) {
			return <svg className="circular" viewBox="25 25 50 50">
				<circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"/>
			</svg>
		} else {
			return <svg viewBox="0 0 24 24">
				<path d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M12,14C13.75,14 15.29,14.72 16.19,15.81L14.77,17.23C14.32,16.5 13.25,16 12,16C10.75,16 9.68,16.5 9.23,17.23L7.81,15.81C8.71,14.72 10.25,14 12,14Z" />
			</svg>
		}
	}

	getButtons() {
		if (this.state.failed) {
			return [<div className="button">Zrušit instalaci</div>, <div className="button">Zkusit znova</div>]
		}

		return super.getButtons()
	}

}

export default Install