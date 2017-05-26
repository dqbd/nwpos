const cart = require("../cart")

module.exports.getTabs = (state) => {
    let toTab = (customer, index) => {
        let seller = module.exports.getSeller(state, customer.seller)
        return {
            index: (index >= state.current) ? index + 1 : index,
            label: `${cart.getTotal(customer.cart)} Kč`,
            color: seller ? seller.color : "#03A9F4"
        }
    }

    let inactive = state.inactive.map(toTab)
    inactive.splice(state.current, 0, toTab(state.customer, state.current))

    return inactive
}

module.exports.getSeller = (state, ic) => {
    if (!ic) return state.sellers[0]
    return state.sellers.find((seller => seller.ic === ic))
}

module.exports.getCurrentSeller = (state) => {
    return module.exports.getSeller(state, state.customer.seller)
}