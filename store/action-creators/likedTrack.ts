import {
	LikedTracks,
	LikedTracksAction,
	LikedTracksActionTypes,
} from '../../types/likedTrack';

export const setLikedTracks = (payload: LikedTracks): LikedTracksAction => {
	return { type: LikedTracksActionTypes.SET_LIKED_TRACKS, payload };
};
