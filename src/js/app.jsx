import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import urlUtils from './utils/url-utils';
import GameActions from './actions/GameActions';
import Breakout from './components/Breakout';
import 'normalize.css';

urlUtils.parseParams();
var tick = urlUtils.get('tick', 66);
var anim = tick <= 66;
var court = null;
var mouse = {x: 0, y: 0};

runBreakout();

function runBreakout() {
	ReactDOM.render(<Breakout />, document.getElementById('game'));

    court = document.querySelector('.court');
    mouse.x = court.offsetLeft + court.offsetWidth/2;
    document.body.addEventListener('mousemove', trackCursor, true);
    document.body.addEventListener('touchmove', trackCursorTouch, true);

    if(anim) {
        window.requestAnimationFrame(doTick);
    }
    else {
        window.setInterval(doTick, tick);
    }
}

function doTick() {
    GameActions.tick({
        x: mouse.x - court.offsetLeft,
        y: mouse.y - court.offsetTop
    });
    if(anim) {
        window.requestAnimationFrame(doTick);
    }
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
