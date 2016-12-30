import React, { Component } from "react"

export default class Config extends Component {
	render() {
		return <form>
			<input type="text" placeholder="Název"></input>
			<input type="text" placeholder="Ulice"></input>
			<input type="text" placeholder="PSČ"></input>
			<input type="text" placeholder="Město"></input>
			<input type="text" placeholder="Číslo provozovny"></input>
			<input type="text" placeholder="DIČ"></input>
			<input type="text" placeholder="Heslo certifikátu"></input>
			<input type="file" placeholder="Certifikát"></input>
		</form>
	}
}