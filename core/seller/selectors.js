const cart = require("../cart")

module.exports.getTabs = (state) => {

    let toTab = (customer, index) => {
        return {
            index: (index >= state.current) ? index + 1 : index,
            label: `${cart.getTotal(customer.cart)} Kč`
        }
    }

    let inactive = state.inactive.map(toTab)
    inactive.splice(state.current, 0, toTab(state.customer, state.current))

    return inactive
}