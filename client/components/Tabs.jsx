import React, { Component } from "react"
import { findDOMNode } from "react-dom"
import SellerColor from "./SellerColor.jsx"
import StatefulToasts from "../containers/StatefulToasts.jsx"

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
        let {tabs, current, onTabSwitch, onTabClose, onTabAdd, nativePrinter, listenToScanner, socketConnected, onScannerSet} = this.props
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
            { nativePrinter !== null && <a className="printer">
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path fill='none' d='M0 0h24v24H0V0z' />
                    <path d='M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v2H8v-4h8v2zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z' />
                    <circle cx='18' cy='11.5' r='1' />
                </svg>
                <span className={["status", nativePrinter ? "active" : "inactive"].join(" ")} />
            </a> }
            { !listenToScanner && <a className="scanner inactive" onTouchTap={() => onScannerSet(!listenToScanner)}>
                <svg viewBox='0 0 24 24'>
                    <path d='M2,6H4V18H2V6M5,6H6V18H5V6M7,6H10V18H7V6M11,6H12V18H11V6M14,6H16V18H14V6M17,6H20V18H17V6M21,6H22V18H21V6Z' />
                </svg>
            </a> }
            { !socketConnected && <a className="scanner inactive">
                <svg viewBox="0 0 24 24">
                    <path d="M3.27,1.44L2,2.72L4.05,4.77C2.75,5.37 1.5,6.11 0.38,7C4.2,11.8 8.14,16.67 12,21.5L15.91,16.63L19.23,19.95L20.5,18.68C14.87,13.04 3.27,1.44 3.27,1.44M12,3C10.6,3 9.21,3.17 7.86,3.5L9.56,5.19C10.37,5.07 11.18,5 12,5C15.07,5 18.09,5.86 20.71,7.45L16.76,12.38L18.18,13.8C20.08,11.43 22,9 23.65,7C20.32,4.41 16.22,3 12,3M5.57,6.29L14.5,15.21L12,18.3L3.27,7.44C4,7 4.78,6.61 5.57,6.29Z" />
                </svg>
            </a> }
            <StatefulToasts />
        </div>
    }
}