import alt from '../alt';
import Immutable from  'immutable';

const CLASS = 'GameActions';

class GameActions {
	constructor() {
		console.log(CLASS, "ctor");
	}

    tick(cusror_loc) {
        return cusror_loc;
    }

    restart() {
        return true;
    }
    start() {
        return true;
    }
    pause() {
        return true;
    }

    resume() {
        return true;
    }

    reset() {
        return true;
    }
    togglePlay() {
        return true;
    }
};
export default alt.createActions(GameActions);
