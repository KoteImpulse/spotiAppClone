export interface PlayerState {
	active: string | null;
	volume: number;
	duration: number;
	currentTime: number;
	pause: boolean;
}
export enum PlayerActionTypes {
	PLAY = 'PLAY',
	PAUSE = 'PAUSE',
	SET_ACTIVE = 'SET_ACTIVE',
	SET_DURATION = 'SET_DURATION',
	SET_CURRENT_TIME = 'SET_CURRENT_TIME',
	SET_VOLUME = 'SET_VOLUME',
}
interface PlayAction {
	type: PlayerActionTypes.PLAY;
}
export type PlayerAction = PlayAction;
