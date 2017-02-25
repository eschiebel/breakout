import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import urlUtils from './utils/url-utils';
import GameActions from './actions/GameActions';
import Breakout from './components/Breakout';
import 'normalize.css';

urlUtils.parseParams();
var tick = urlUtils.get('tick', 16.7);	// 60 frames/sec
var court = null;
var mouse = {x: 0, y: 0};
var lastTickTime = 0;

document.addEventListener("visibilitychange", handleVisibilityChange);

runBreakout();

function runBreakout() {
	ReactDOM.render(<Breakout />, document.getElementById('game'));

    court = document.querySelector('.court');
    mouse.x = court.offsetLeft + court.offsetWidth/2;
    document.body.addEventListener('mousemove', trackCursor, true);
    document.body.addEventListener('touchmove', trackCursorTouch, true);

    doTick();
}

function doTick(timestamp) {
	if(timestamp - lastTickTime >= tick) {
		lastTickTime = timestamp;
    GameActions.tick({
        x: mouse.x - court.offsetLeft,
        y: mouse.y - court.offsetTop
    });
	}
  window.requestAnimationFrame(doTick);
}

function trackCursor(event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
}
function trackCursorTouch(event) {
    //event.preventDefault();
    mouse.x = event.touches[0].pageX;
    mouse.y = event.touches[0].pageY;
}

function handleVisibilityChange() {
    if(document.hidden) {
        GameActions.pause();
    }
}
