import React, { Component } from "react"
import { findDOMNode } from "react-dom"
import SellerColor from "./SellerColor.jsx"

class Tab extends Component {
    render() {
        return <div className={this.props.active ? "tab active" : "tab"}>
            <SellerColor color={this.props.color} />
            <div className="content">
                <span className="label" onTouchTap={this.props.onShow}>{this.props.label}</span>
                <a className="close" onTouchTap={this.props.onClose}><svg viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg></a>
            </div>
        </div>
    }
}

export default class Tabs extends Component {

    componentDidUpdate(prevProps) {
		if (this.props.current !== prevProps.current) {
			let itemComponent = this.refs.active
			if (itemComponent) {
				let domNode = findDOMNode(itemComponent)

				let parentRect = findDOMNode(this).getBoundingClientRect()
				let childRect = domNode.getBoundingClientRect()

				if (childRect.left < parentRect.left || childRect.right > parentRect.right) {
					domNode.scrollIntoView()
				}
			}
		}
	}

    render() {
        let {tabs, current, onTabSwitch, onTabClose, onTabAdd, nativePrinter, listenToScanner, onScannerSet} = this.props
        if (!tabs || tabs.length <= 0) return null

        return <div className="tabs">
            <div className="tablist">
                {tabs.map((tab, index) => 
                    <Tab 
                        active={current === index} 
                        key={index} 
                        ref={current === index ? "active" : null}
                        onShow={() => onTabSwitch(index)} 
                        onClose={() => onTabClose(index)} 
                        label={tab.label} 
                        color={tab.color} />
                )}
            </div>
            <a className="newtab" onTouchTap={onTabAdd}><svg viewBox="0 0 24 24"><path d="M19,6H22V8H19V11H17V8H14V6H17V3H19V6M17,17V14H19V19H3V6H11V8H5V17H17Z" /></svg></a>
            <a className={["scanner", listenToScanner ? 'active' : 'inactive'].join(' ')} onTouchTap={() => onScannerSet(!listenToScanner)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0V0z"/>
                    <path d="M17 12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5 5-2.24 5-5zm-5 3c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm-7 0H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/>
                </svg>
            </a>
            { nativePrinter !== null && <a className="printer">
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path fill='none' d='M0 0h24v24H0V0z' />
                    <path d='M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v2H8v-4h8v2zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z' />
                    <circle cx='18' cy='11.5' r='1' />
                </svg>
                <span className={["status", nativePrinter ? "active" : "inactive"].join(" ")} />
            </a> }
        </div>
    }
}