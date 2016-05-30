import alt from '../alt';
import Immutable from  'immutable';
import immutable from  'alt-utils/lib/ImmutableUtil';
import GameActions from '../actions/GameActions';
import {intersectUtils, NOINTERSECT, LEFT, RIGHT, TOP, BOTTOM} from '../utils/intersect-utils';

const CLASS = 'GameStore';
class GameStore {
	constructor() {
		console.log(CLASS, "ctor");

		this.bindListeners({
            onRestart: GameActions.restart,
            onStart: GameActions.start,
			onTick: GameActions.tick,
			onPause: GameActions.pause,
            onResume: GameActions.resume,
            onReset: GameActions.reset,
            onTogglePlay: GameActions.togglePlay
		});

		this.state = initGameState();
	}

    onRestart() {
        this.setState(initGameState());
    }
    onStart() {
        var state = this.state.set("status", "running");
        this.setState(state);
    }
    onPause() {
        this.setState(this.state.set('status', "paused"));
    }
    onResume() {
        this.setState(this.state.set('status', "running"));
    }
    onReset() {
        this.setState(initGameState());
    }

    //  if the game is not running, start it
    //  otherwise toggle paused state
    onTogglePlay() {
        var status = this.state.get('status');
        var newstatus;

        switch(status) {
        case "stopped":
        case "paused":
            newstatus = "running";
            break;
        case "running":
            newstatus = "paused";
        }
        if(newstatus) {
            this.setState(this.state.set('status', newstatus));
        }
    }

    onTick(cursor_loc) {
        //console.log(CLASS, 'onTick');
        var state = this.state;
        var ball = state.get('ball');
        var wall = state.get('wall');
        var paddle = state.get('paddle');
        var score = state.get('score');
        var points = 0;

        // always get new position of paddle
        paddle = this.nextPaddle(paddle, cursor_loc);

        if("running" === this.state.get('status')) {
            // new position of ball
            ({ball, wall, points} = this.nextBall(ball, paddle, wall));
            if(ball === null) {
                let nballs = state.get('balls') - 1;
                state = state.set('status', nballs > 0 ? 'paused' : 'lost').set('balls', nballs);
                ball = initBall();
            }
            else if(!moreBricks(wall)) {
                state = state.set('status', 'won');
            }
        }

        state =  state.set('ball', ball).set('wall', wall).set('paddle', paddle).set('score', state.get('score') + points);
        this.setState(state);
    }
    nextBall(ball, paddle, wall) {
        var pos = ball.get('pos');
        var d = ball.getIn(['sz', 'd']);
        var x = pos.get('x'), y = pos.get('y');
        var vel = ball.get('vel');
        var vx = vel.get('x'), vy = vel.get('y');
        var cw = this.state.getIn(['court', 'sz', 'w']) - d;    // account for size of the ball
        var ch = this.state.getIn(['court', 'sz', 'h']) - d;
        var points = 0;

        if(vy > 0) { // heading down
            if(pos.get('y') + d + vy > ch) {
                // hit the bottom
                return {ball: null, wall: wall, points: 0};
            }
        }


        var newball = this.checkPaddle(ball, paddle);
        var newbricks;
        if(ball === newball) {
            let result = this.checkWall(ball, wall);
            newball = result.ball;
            wall = result.wall;
            points += result.points;
        }

        if(ball === newball) {
            let newx = x + vx;
            if(vx > 0) {
                if(newx > cw) {
                    vx = -vx;
                    newx = cw - (newx-cw);
                }
            }
            else if(vx < 0) {
                if(newx < 0) {
                    vx = -vx;
                    newx = -newx
                }
            }
            let newy = y + vy;
            if(vy > 0) {
                if(newy > ch) {
                    vy = -vy;
                    newy = ch - (newy-ch);
                }
            }
            else if(vy < 0) {
                if(newy < 0) {
                    vy = -vy;
                    newy = -newy
                }
            }

            pos = pos.set('x', newx).set('y', newy);
            vel = vel.set('x', vx).set('y', vy);

            newball = ball.set('pos', pos)
                    .set('vel', vel);
        }
        return {ball: newball, wall: wall, points: points};
    }
    checkPaddle(ball, paddle) {
        // pos and size of the ball
        var bx = ball.getIn(['pos', 'x']), by = ball.getIn(['pos', 'y']), d = ball.getIn(['sz', 'd']);
        var vx = ball.getIn(['vel', 'x']), vy = ball.getIn(['vel', 'y']);

        // ball's vector
        var ballPath = {x0: bx, y0: by, x1: bx + vx, y1: by + vy};
        if(vx > 0) ballPath.x1 += d;    // if heading right or down, add diameter of ball to vector
        if(vy > 0) ballPath.y1 += d;

        // pos and size of the paddle
        var px = paddle.getIn(['pos', 'x']), py = paddle.getIn(['pos', 'y']);
        var pw = paddle.getIn(['sz', 'w']), ph = paddle.getIn(['sz', 'h']);
        var paddleRect = {left: px, top: py, width: pw, height: ph}

        var outcode = intersectUtils.doLineRectIntersect(ballPath, paddleRect);

        if(outcode) {
            // depending on where the balls path was clipped, change ball's path
            if(outcode & TOP) {
                ballPath.y1 = 2 * paddleRect.top - (ballPath.y1 + ball.getIn(['sz', 'd']));
                vy = -vy;
            }
            else if(outcode && BOTTOM) {
                ballPath.y1 = 2 * (paddleRect.top + paddleRect.height) - ballPath.y1;
                vy = -vy;
            }
            if(outcode & LEFT) {
                ballPath.x1 = 2 * paddleRect.left - (ballPath.x1 + ball.getIn(['sz', 'd']));
                vx = -vx;
            }
            else if(outcode & RIGHT) {
                ballPath.x1 = 2 * (paddleRect.left + paddleRect.width) - ballPath.x1;
                vx = -vx;
            }

            // let the paddle impact the balls direction
            let paddle_v = paddle.getIn(['vel', 'x']);
            vx += paddle_v/2;

            ball = ball.setIn(['pos', 'x'], ballPath.x1).setIn(['pos', 'y'], ballPath.y1)
                    .setIn(['vel', 'x'], vx).setIn(['vel', 'y'], vy);
        }

        return ball;
    }

    checkWall(ball, wall) {
        var points = 0;

        // pos and size of the ball
        var bx = ball.getIn(['pos', 'x']), by = ball.getIn(['pos', 'y']), d = ball.getIn(['sz', 'd']);
        var vx = ball.getIn(['vel', 'x']), vy = ball.getIn(['vel', 'y']);

        // ball's vector
        var ballPath = {x0: bx, y0: by, x1: bx + vx, y1: by + vy};
        if(vx > 0) ballPath.x1 += d;    // if heading right or down, add diameter of ball to vector
        if(vy > 0) ballPath.y1 += d;

        // the wall's config
        var brickw = wall.getIn(['bricksz', 'w']), brickh = wall.getIn(['bricksz', 'h']);
        var bricks = wall.get('bricks');
        var wallrect = {
            left: 0, top: wall.getIn(['pos', 'y']),
            height: brickh * bricks.count(),
            width: brickw * bricks.get(0).count()       // assume first row is typical
        };

        let nrows = bricks.count();
        for(let r = 0; r < nrows; ++r) {
            let row = bricks.get(r);
            let ncols = row.count();
            for(let c = 0; c < ncols; ++c) {
                let brick = row.get(c);
                if(brick) {
                    let brickrect = {
                        left: c * brickw,
                        top: wallrect.top + r * brickh,
                        width: brickw,
                        height: brickh
                    };
                    let outcode = intersectUtils.doLineRectIntersect(ballPath, brickrect);
                    if(outcode) {
                        points += bricks.getIn([r, c]);     // add value of this brick
                        bricks = bricks.setIn([r, c], 0);   // remove the brick

                        // depending on where the balls path was clipped, change ball's path
                        if(outcode & TOP) {
                            ballPath.y1 = 2 * brickrect.top - (ballPath.y1 + ball.getIn(['sz', 'd']));
                            vy = -vy;
                        }
                        else if(outcode && BOTTOM) {
                            ballPath.y1 = 2 * (brickrect.top + brickrect.height) - ballPath.y1;
                            vy = -vy;
                        }
                        if(outcode & LEFT) {
                            ballPath.x1 = 2 * brickrect.left - (ballPath.x1 + ball.getIn(['sz', 'd']));
                            vx = -vx;
                        }
                        else if(outcode & RIGHT) {
                            ballPath.x1 = 2 * (brickrect.left + brickrect.width) - ballPath.x1;
                            vx = -vx;
                        }
                        ball = ball.setIn(['pos', 'x'], ballPath.x1).setIn(['pos', 'y'], ballPath.y1)
                                .setIn(['vel', 'x'], vx).setIn(['vel', 'y'], vy);
                    }
                }
            }
        }
        wall = wall.set('bricks', bricks);
        return {ball, wall, points};
    }

    nextPaddle(paddle, loc) {

        if(loc.x < 0) {
            loc.x = 0;
        }
        else {
            let maxx = this.state.getIn(['court', 'sz', 'w']) - this.state.getIn(['paddle', 'sz', 'w']);
            if(loc.x > maxx) {
                loc.x = maxx;
            }
        }
        let vx = paddle.getIn(['vel', 'x']);
        vx = loc.x - paddle.getIn(['pos', 'x']);
        return paddle.setIn(['pos', 'x'], loc.x).setIn(['vel', 'x'], vx);
    }

}

const courtW = 600;
const courtH = 750;
const paddleW = 60;
const brickRows = 5;
const bricksPerRow = 8;
const brickW = courtW/bricksPerRow;
const brickH = brickW / 3.5;
const wallTop = courtH / 10;
// game status: stopped | running | paused | won | lost
function initGameState() {
    return new Immutable.fromJS({
        status: "stopped",
        score: 0,
        balls: 3,
        court: {
            sz: {w: courtW, h: courtH}
        },
        ball: initBall(),
        paddle: {
            sz: {w: paddleW, h: 10},
            pos: {x: courtW*.45, y: courtH*.9},
            vel: {x: 0}
        },
        wall: initWall()
    });
}

function initBall() {
    return Immutable.fromJS( {
        sz: {d: 15},
        pos: {
            x: Math.random() * courtW * .8 + courtW * .1,
            y: wallTop + (brickRows + 1) * brickH
        },
        vel: {
            x: (Math.random() * 5 + 5) * (Math.random() < .5 ? 1 : -1),
            y: (Math.random() * 5 + 5)
        }
    });
}


function initWall() {

    var bricks = [];
    for(let r = 0; r < brickRows; ++r) {
        let row = [];
        for(let c = 0; c < bricksPerRow; ++c) {
            row.push(1);
        }
        bricks.push(row);
    }
    return {
        pos: {y: wallTop},
        bricksz: {w: brickW, h: brickH},
        bricks: bricks
    }
}

// function countBricks(wall) {
//     var count = wall.get('bricks').reduce(function(prev, curr, index, row) {
//         return prev + row.get(index).reduce(function(prev, curr) {
//             return prev + curr;
//         }, 0);
//     }, 0);
//     return count;
// }
function moreBricks(wall) {
    var more = wall.get('bricks').some(function(row) {
        return row.some(function(brick) {
            return !!brick;
        });
    });
    return more;
}
export default alt.createStore(immutable(GameStore), 'GameStore');
