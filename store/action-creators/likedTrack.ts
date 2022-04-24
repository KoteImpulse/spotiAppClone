import {
	LikedTracksAction,
	LikedTracksActionTypes,
} from '../../types/likedTrack';
import { Song } from '../../types/song';

export const setLikedTracks = (payload: {
	songsArray: Song[];
	liked: boolean[];
	total: number;
}): LikedTracksAction => {
	return { type: LikedTracksActionTypes.SET_LIKED_TRACKS, payload };
};
