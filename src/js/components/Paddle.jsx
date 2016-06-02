import React from 'react';

const paddleWidth = 50;
const paddleHeight = 10;

function Paddle(props) {

    var styl = {
        width: props.width + 'px',
        height: props.height + 'px',
        transform: 'translate(' + (props.x - props.width/2) + 'px,' + props.y + 'px)'
    }
    return <div className='paddle' style={styl} />;
}

export default Paddle;
