import React from 'react';
import GameActions from '../actions/GameActions';

class Scoreboard extends React.Component {

    render() {
        return (
            <div className='scoreboard'>
                <div>
                    <button title="stop" onClick={this.restart.bind(this)}>Restart</ button>
                </div>
                <div>
                    <span className='label'>Score:</span> <span className="score">{this.props.score}</span>
                </div>
                <div>
                    <span className='label'>Balls:</span> <span className='value balls'>{this.props.balls}</span>
                </div>
            </div>
        );
    }

    restart(event) {
        GameActions.restart();
    }
};

Scoreboard.propTypes = {
    score: React.PropTypes.number.isRequired,
    balls: React.PropTypes.number.isRequired
}

export default Scoreboard;
