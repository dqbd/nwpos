import React from 'react'

export default class Toasts extends React.Component {

  componentDidUpdate() {
    clearTimeout(this.timer)

    if (this.props.toasts.length > 0) {
      this.timer = setTimeout(() => {
        this.props.clearToasts()
      }, 3000)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    const { toasts, removeToast } = this.props
    return (
      <div className="toasts">
        {toasts.map(({ message, type }, index) => (
          <div key={index} onClick={() => removeToast(index)} className={["toast", type].join(" ")}>
            <div className="message">{message}</div>
            <div className="close">
              <svg viewBox="0 0 24 24">
                <path fill="#000000" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    )
  }
}