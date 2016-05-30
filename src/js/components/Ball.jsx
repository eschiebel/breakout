import React from 'react';


function Ball(props) {
    var styl = {
        width: props.diameter + 'px',
        height: props.diameter + 'px',
        transform: 'translate(' + props.x + 'px,' + props.y + 'px)'
    }
    return <div className='ball' style={styl} />;
}

export default Ball;
