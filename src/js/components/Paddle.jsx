import React from 'react';

const paddleWidth = 50;
const paddleHeight = 10;

function Paddle(props) {

    var styl = {
        width: props.width + 'px',
        height: props.height + 'px',
        transform: 'translate(' + props.x + 'px,' + props.y + 'px)'
    }
    return <div className='paddle' style={styl} />;
}

export default Paddle;
