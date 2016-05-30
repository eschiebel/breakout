import React from 'react';
import Brick from './Brick';

class Wall extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.bricks !== this.props.bricks
            || nextProps.y !== this.props.y;
    }

    render() {
        var bricks = [];
        var x = 0, y = 0;
        var nrows = this.props.bricks.count();
        for(let r = 0; r < nrows; ++r) {
            let row = this.props.bricks.get(r);
            let ncols = row.count();
            for(let c = 0; c < ncols; ++c) {
                let brick = row.get(c);
                if(brick) {
                    bricks.push(<Brick key={r + '_' + c} type={brick} width={this.props.brickWidth} height={this.props.brickHeight} x={x} y={y}/>);
                }
                x += this.props.brickWidth;
            }
            x = 0;
            y += this.props.brickHeight;
        }
        return (
            <div className='wall' style={{top: this.props.y + 'px'}}>
                {bricks}
            </div>
        );
    }
}
Wall.propTypes = {
    y: React.PropTypes.number.isRequired,
    brickWidth: React.PropTypes.number.isRequired,
    brickHeight: React.PropTypes.number.isRequired,
    bricks: React.PropTypes.object.isRequired       // Immutable.List
};
export default Wall;
