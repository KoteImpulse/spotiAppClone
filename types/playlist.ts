import { Track } from './song';

export interface PlaylistState {
	userPlaylists: Playlist[];
}
export interface Playlist {
	collaborative: boolean;
	description: string;
	external_urls: { spotify: string };
	href: string;
	id: string;
	images: any[];
	name: string;
	owner: {
		display_name: string;
		external_urls: { spotify: string };
		href: string;
		id: string;
		type: string;
		uri: string;
	};
	primary_color: string;
	public: boolean;
	snapshot_id: string;
	tracks: { href: string; total: number; items: Track };
	type: string;
	uri: string;
}

export enum PlaylistActionTypes {
	SET_PLAYLIST = 'SET_PLAYLIST',
	SELECT_PLAYLIST = 'SELECT_PLAYLIST',
	SET_PLAYLIST_TRACKS = 'SET_PLAYLIST_TRACKS',
}
interface SetPlaylistAction {
	type: PlaylistActionTypes.SET_PLAYLIST;
	payload: Playlist[];
}
interface SelectPlaylistAction {
	type: PlaylistActionTypes.SELECT_PLAYLIST;
	payload: Playlist;
}
export type PlaylistAction = SetPlaylistAction | SelectPlaylistAction;
