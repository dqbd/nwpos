import { connect } from "react-redux"
import ScanPopup from "../components/ScanPopup.jsx"

import { seller, customer } from "../../core"

export default connect(state => ({
  searches: state.eanSearches,
}), dispatch => ({
  getSearches: (query) => dispatch(seller.retrieveEanSearches(query)),
  clearSearches: () => dispatch(seller.clearEanSearches()),
  addEan: ({ price, name, ean }) => dispatch(customer.addEan({ price, name, ean }))
}))(ScanPopup)