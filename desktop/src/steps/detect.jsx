import React from "react"

const Detect = () => <div class="step detect loading">
	<h1>Hledání serverů</h1>
	<h2>Zjišťuji servery běžící na lokální síti</h2>
	<div class="image">
		<svg class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
			<circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
		</svg>
	</div>
	<div class="list">
		<div class="server">
			<div class="ip">192.168.1.130</div>
			<div class="port">Port: 80</div>
		</div>
	</div>
</div>
			

export default Detect