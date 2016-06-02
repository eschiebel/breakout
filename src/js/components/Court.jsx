import React from 'react';
import Ball from './Ball';
import Paddle from './Paddle';
import Wall from './Wall';
import GameActions from '../actions/GameActions';

const CLASS = 'Court';

class Court extends React.Component {

    render() {
        var gamestatus = this.props.gameState.get('status');
        var message = null;
        switch(gamestatus) {
        case "stopped":
            message = "Click or touch to start\nagain to pause"
            break;
        case "paused":
            message = "Click to continue";
            break;
        case "won":
            message = "Congratulations!";
            break;
        case "lost":
            message = "Sorry, you lose";
            break;
        }
        if(message) {
            message = <div className="message"  >{message}</div>;
        }
        var courtsz = this.props.gameState.getIn(['court', 'sz']);
        return (
            <div className='court' style={{width: courtsz.get('w') + 'px', height: courtsz.get('h') + 'px'}} onClick={this.onClick.bind(this)} onTouchStart={this.onClick.bind(this)}>
                <Wall y={this.props.gameState.getIn(['wall', 'pos', 'y'])}
                    brickWidth={this.props.gameState.getIn(['wall', 'bricksz', 'w'])} brickHeight={this.props.gameState.getIn(['wall', 'bricksz', 'h'])}
                    bricks={this.props.gameState.getIn(['wall', 'bricks'])}
                />
                <Paddle x={this.props.gameState.getIn(['paddle', 'pos', 'x'])} y={this.props.gameState.getIn(['paddle', 'pos', 'y'])}
                    width={this.props.gameState.getIn(['paddle', 'sz', 'w'])} height={this.props.gameState.getIn(['paddle', 'sz', 'h'])}
                    courtWidth={courtsz.get('w')} courtHeight={courtsz.get('h')}
                />
                <Ball x={this.props.gameState.getIn(['ball', 'pos', 'x'])} y={this.props.gameState.getIn(['ball', 'pos', 'y'])}
                    diameter={this.props.gameState.getIn(['ball', 'sz', 'd'])}
                    courtWidth={courtsz.get('w')} courtHeight={courtsz.get('h')}
                />
                {message}
            </div>
        );
    }

    onClick(event) {
        event.preventDefault();
        GameActions.togglePlay();
    }
};

export default Court;
