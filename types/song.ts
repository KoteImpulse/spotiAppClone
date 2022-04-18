import { Album } from './album';
import { Artist } from './artist';
import { User } from './user';

export interface Song {
	album: Album;
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	episode: boolean;
	explicit: boolean;
	external_ids: { isrc: string };
	external_urls: { spotify: string };
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string;
	track: boolean;
	track_number: number;
	type: string;
	uri: string;
}

export interface Track {
	added_at: string;
	added_by: User;
	is_local: boolean;
	primary_color: string | null;
	track: Song;
	video_thumbnail: { url: string | null };
}

export enum SongActionTypes {
	SET_SONGS = 'SET_SONGS',
	SELECT_SONG = 'SELECT_SONG',
}
interface SetSongsAction {
	type: SongActionTypes.SET_SONGS;
	payload: { songsArray: Track[]; liked: boolean[]; total: number };
}
interface SelectSongAction {
	type: SongActionTypes.SELECT_SONG;
	payload: Track;
}
export type SongAction = SetSongsAction | SelectSongAction;
