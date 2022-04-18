export interface LikedTracksState {
	likedTracks: LikedTracks;
}
export interface LikedTracks {
	collaborative: boolean;
	description: string;

}
export enum LikedTracksActionTypes {
	SET_LIKED_TRACKS = 'SET_LIKED_TRACKS',
}
interface SetLikedTracksAction {
	type: LikedTracksActionTypes.SET_LIKED_TRACKS;
	payload: LikedTracks;
}

export type LikedTracksAction = SetLikedTracksAction;
