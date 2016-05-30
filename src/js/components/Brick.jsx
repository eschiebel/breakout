import React from 'react';

function Brick(props) {
    var styl = {
        width: props.width + 'px',
        height: props.height + 'px',
        left: props.x + 'px',
        top: props.y + 'px'
    };
    return <div className={'brick ' + props.type} style={styl}/>;
}
Brick.propTypes = {
    type: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired
}
export default Brick;
