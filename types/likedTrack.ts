import { Song } from './song';

export enum LikedTracksActionTypes {
	SET_LIKED_TRACKS = 'SET_LIKED_TRACKS',
}
interface SetLikedTracksAction {
	type: LikedTracksActionTypes.SET_LIKED_TRACKS;
	payload: {songsArray: Song[], liked: boolean[], total: number};
}

export type LikedTracksAction = SetLikedTracksAction;


