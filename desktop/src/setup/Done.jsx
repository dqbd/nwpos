import React from "react"
import Step from "./step.jsx"

class Done extends Step {
	getTitle() {
		return "Instalace hotova"
	}

	getDescription() {
		return "Už jen jeden krok k provozu!"
	}

	getImage() {
		return <svg viewBox="0 0 24 24">
			<path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
		</svg>
	}

	getButtons() {
		return [<div className="button">Přejít k aplikaci</div>]
	}
}

export default Done