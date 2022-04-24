import { Album } from './album';
import { Song } from './song';

export interface ArtistState {
	followingArtists: Artist[];
}
export interface Artist {
	external_urls: {
		spotify: string;
	};
	followers: {
		href: string;
		total: number;
	};
	genres: string[];
	href: string;
	id: string;
	images: {
		url: string;
		height: number;
		width: number;
	}[];
	name: string;
	popularity: number;
	type: string;
	uri: string;
}
export interface ArtistData {
	songsArray: Song[];
	liked: boolean[];
	albums: Album[];
	relatedArtists: Artist[];
}

export enum ArtistActionTypes {
	SET_ARTISTS = 'SET_ARTISTS',
	SELECT_ARTIST = 'SELECT_ARTIST',
	SET_ARTIST_DATA = 'SET_ARTIST_DATA',
}
interface SetArtistsAction {
	type: ArtistActionTypes.SET_ARTISTS;
	payload: {
		artistsArray: Artist[];
		total: number;
		liked: boolean[];
	};
}
interface SelectArtistAction {
	type: ArtistActionTypes.SELECT_ARTIST;
	payload: Artist;
}
interface SetArtistDataAction {
	type: ArtistActionTypes.SET_ARTIST_DATA;
	payload: ArtistData;
}
export type ArtistAction =
	| SetArtistsAction
	| SelectArtistAction
	| SetArtistDataAction;
