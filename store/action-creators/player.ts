import { PlayerAction, PlayerActionTypes } from '../../types/player';

export const play = (): PlayerAction => {
	return { type: PlayerActionTypes.PLAY };
};
