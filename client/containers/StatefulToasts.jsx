import { connect } from "react-redux"
import Toasts from "../components/Toasts.jsx"

import { seller } from "../../core"

export default connect(state => ({
  toasts: state.toasts,
}), dispatch => ({
  clearToasts: () => dispatch(seller.clearToasts()),
  removeToast: (index) => dispatch(seller.removeToast(index)),
}))(Toasts)