let screen = require("./actionTypes")

module.exports = (state = 0, action) => {
	let real = state | 0
	let rest = Math.ceil(Math.abs(state * 1000) % 1000)

	let decimal = Math.floor(rest / 10) 
	let position = rest % 10 

	switch (action.type) {
		case screen.ADD_DIGIT:
			if (real < Math.pow(10, 7)) {
				if (position > 0 && position < 3) {
					decimal = decimal + action.digit * Math.pow(10, 2 - position)
					position = Math.min(3, position + 1) 
				} else if (position < 3) {
					real = real * 10 + action.digit
				}
			}

			break
		case screen.REMOVE_DIGIT:
			if (position > 0) {
				position = position - 1
				decimal = Math.floor(decimal / Math.pow(10, 3 - position)) * 10
			} else {
				real = Math.floor(real / 10)
			}
			break
		case screen.ENABLE_DECIMAL:
			if (position == 0) {
				position = 1
			}
			break
		case screen.CLEAR:
			return 0
		case screen.SET:
			let newReal = action.value | 0
			let newRest = Math.floor(Math.abs(action.value * 100) % 100) 

			while(newRest > 100) {
				newRest = Math.floor(newRest / 10)
			}

			if (newReal < 0) {
				return (1000 * newReal - 10 * newRest - 3 * (newRest > 0)) / 1000
			} 
			
			return (1000 * newReal + 10 * newRest + 3 * (newRest > 0)) / 1000
		case screen.TOGGLE_NEGATIVE:
			real *= -1
			decimal *= ((real > 0) ? 1 : -1)
			position *= ((real > 0) ? 1 : -1)

			break
	}

	return (1000 * real + 10 * decimal + position) / 1000
}

