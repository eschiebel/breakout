import React from 'react';


function Ball(props) {
    // unsure what is faster, this or setting pos
    //transform: 'translate(' + props.x + 'px,' + props.y + 'px)'

    var styl = {
        width: props.diameter + 'px',
        height: props.diameter + 'px',
        left: props.x + 'px',
        top: props.y + 'px'
    }
    return <div className='ball' style={styl} />;
}

export default Ball;
