import {
	PlayerAction,
	PlayerActionTypes,
	PlayerState,
} from '../../types/player';

const initialState: PlayerState = {
	active: null,
	currentTime: 0,
	duration: 0,
	pause: true,
	volume: 50,
};

export const playerReducer = (
	state = initialState,
	action: PlayerAction
): PlayerState => {
	switch (action.type) {
		case PlayerActionTypes.PLAY:
			return { ...state };

		default:
			return state;
	}
};
