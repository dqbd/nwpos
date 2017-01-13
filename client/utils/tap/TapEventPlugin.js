/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule TapEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require('react-dom/lib/EventConstants');
var EventPluginUtils = require('react-dom/lib/EventPluginUtils');
var EventPropagators = require('react-dom/lib/EventPropagators');
var SyntheticUIEvent = require('react-dom/lib/SyntheticUIEvent');
var TouchEventUtils = require('./TouchEventUtils');
var ViewportMetrics = require('react-dom/lib/ViewportMetrics');

var keyOf = require('fbjs/lib/keyOf');
var topLevelTypes = EventConstants.topLevelTypes;

var isStartish = EventPluginUtils.isStartish;
var isEndish = EventPluginUtils.isEndish;

var isTouch = function(topLevelType) {
	var touchTypes = [
		'topTouchCancel',
		'topTouchEnd',
		'topTouchStart',
		'topTouchMove'
	];
	return touchTypes.indexOf(topLevelType) >= 0;
}

/**
 * Number of pixels that are tolerated in between a `touchStart` and `touchEnd`
 * in order to still be considered a 'tap' event.
 */
var tapMoveThreshold = 110;
var ignoreMouseThreshold = 750;
var startCoords = {x: null, y: null};
var cancelCoords = {x: null, y: null};

var Axis = {
	x: {page: 'pageX', client: 'clientX', envScroll: 'currentPageScrollLeft'},
	y: {page: 'pageY', client: 'clientY', envScroll: 'currentPageScrollTop'}
};

function getAxisCoordOfEvent(axis, nativeEvent) {
	var singleTouch = TouchEventUtils.extractSingleTouch(nativeEvent);
	if (singleTouch) {
		return singleTouch[axis.page];
	}
	return axis.page in nativeEvent ?
		nativeEvent[axis.page] :
		nativeEvent[axis.client] + ViewportMetrics[axis.envScroll];
}

function getDistance(coords, nativeEvent) {
	var pageX = getAxisCoordOfEvent(Axis.x, nativeEvent);
	var pageY = getAxisCoordOfEvent(Axis.y, nativeEvent);
	return Math.pow(
		Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2),
		0.5
	);
}

var touchEvents = [
	'topTouchStart',
	'topTouchCancel',
	'topTouchEnd',
	'topTouchMove',
];

var dependencies = [
	'topMouseDown',
	'topMouseMove',
	'topMouseUp',
].concat(touchEvents);

var eventTypes = {
	touchTap: {
		phasedRegistrationNames: {
			bubbled: keyOf({onTouchTap: null}),
			captured: keyOf({onTouchTapCapture: null})
		},
		dependencies: dependencies
	},
	longTouchTap: {
		phasedRegistrationNames: {
			bubbled: keyOf({onLongTouchTap: null}),
			captured: keyOf({onLongTouchTapCapture: null})
		},
		dependencies: dependencies
	}
};

var now = (function() {
	if (Date.now) {
		return Date.now;
	} else {
		// IE8 support: http://stackoverflow.com/questions/9430357/please-explain-why-and-how-new-date-works-as-workaround-for-date-now-in
		return function () {
			return +new Date;
		}
	}
})();

let longTouchTimeout = null


function createTapEventPlugin() {
	return {
		tapMoveThreshold: tapMoveThreshold,
		ignoreMouseThreshold: ignoreMouseThreshold,
		eventTypes: eventTypes,

		/**
		 * @param {string} topLevelType Record from `EventConstants`.
		 * @param {DOMEventTarget} targetInst The listening component root node.
		 * @param {object} nativeEvent Native browser event.
		 * @return {*} An accumulation of synthetic events.
		 * @see {EventPluginHub.extractEvents}
		 */
		extractEvents: function(
			topLevelType,
			targetInst,
			nativeEvent,
			nativeEventTarget
		) {

			if (!isStartish(topLevelType) && !isEndish(topLevelType)) {
				return null;
			}

			if (!isTouch(topLevelType) && (navigator.platform.indexOf('Win') == -1)) {
				return null;
			}

			if (topLevelType === "topTouchStart") {
				cancelCoords.x = 0;
				cancelCoords.y = 0;

				clearTimeout(longTouchTimeout)
				longTouchTimeout = setTimeout(() => {
					let event = new TouchEvent("touchcancel", {
						touches: nativeEvent.touches,
						targetTouches: nativeEvent.targetTouches,
						changedTouches: nativeEvent.changedTouches,
						bubbles: true,
						cancelable: true
					});
					nativeEventTarget.dispatchEvent(event)
				}, 300)
			} 

			if (topLevelType === "topTouchCancel") {
				cancelCoords.x = getAxisCoordOfEvent(Axis.x, nativeEvent);
				cancelCoords.y = getAxisCoordOfEvent(Axis.y, nativeEvent);
			}

			if (topLevelType === "topTouchEnd") {
				clearTimeout(longTouchTimeout)
				if (getDistance(cancelCoords, nativeEvent) < tapMoveThreshold) {
					return null
				} 
			}

			var event = null;
			var distance = getDistance(startCoords, nativeEvent);
			if (isEndish(topLevelType) && distance < tapMoveThreshold) {

				if (topLevelType === "topTouchCancel") {
					event = [SyntheticUIEvent.getPooled(
						eventTypes.longTouchTap,
						targetInst,
						nativeEvent,
						nativeEventTarget
					)];
				} else {
					event = [SyntheticUIEvent.getPooled(
						eventTypes.touchTap,
						targetInst,
						nativeEvent,
						nativeEventTarget
					)];
				}
			}

			if (isStartish(topLevelType)) {
				startCoords.x = getAxisCoordOfEvent(Axis.x, nativeEvent);
				startCoords.y = getAxisCoordOfEvent(Axis.y, nativeEvent);
			} else if (isEndish(topLevelType)) {
				startCoords.x = 0;
				startCoords.y = 0;
			}

			EventPropagators.accumulateTwoPhaseDispatches(event);
			return event;
		}

	};
}

module.exports = createTapEventPlugin;
