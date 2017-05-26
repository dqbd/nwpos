import React, { Component } from "react"

class Tab extends Component {
    render() {
        return <div className={this.props.active ? "tab active" : "tab"}>
            <span className="label" onClick={this.props.onShow}>{this.props.label}</span>
            <a className="close" onClick={this.props.onClose}><svg viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg></a>
        </div>
    }
}

export default class Tabs extends Component {

    handleOnShow() {

    }

    handleOnClose() {

    }

    render() {
        let {tabs, current, onTabSwitch, onTabClose, onTabAdd} = this.props
        if (!tabs || tabs.length <= 0) return null

        return <div className="tabs">
            <div className="tablist">
                {tabs.map((tab, index) => <Tab active={current === index} key={index} onShow={() => onTabSwitch(index)} onClose={() => onTabClose(index)} label={tab.label} />)}
            </div>
            <a className="newtab" onClick={onTabAdd}><svg viewBox="0 0 24 24"><path d="M19,6H22V8H19V11H17V8H14V6H17V3H19V6M17,17V14H19V19H3V6H11V8H5V17H17Z" /></svg></a>
        </div>
    }
}