import {
	Playlist,
	PlaylistAction,
	PlaylistActionTypes,
} from './../../types/playlist';

export const setPlaylist = (payload: Playlist[]): PlaylistAction => {
	return { type: PlaylistActionTypes.SET_PLAYLIST, payload };
};
export const selectPlaylist = (payload: Playlist): PlaylistAction => {
	return { type: PlaylistActionTypes.SELECT_PLAYLIST, payload };
};
