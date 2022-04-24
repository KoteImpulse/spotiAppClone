import { Song } from './song';

export interface AlbumState {
	followingAlbums: IAlbum[];
}
export interface IAlbum {
	added_at: string;
	album: Album;
}
export interface Album {
	album_type: string;
	album_group?: string;
	total_tracks: number;
	available_markets: string[];
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	images: {
		url: string;
		height: number;
		width: number;
	}[];
	name: string;
	release_date: string;
	release_date_precision: string;
	restrictions: {
		reason: string;
	};
	type: string;
	uri: string;
	artists: {
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
	}[];
	tracks: {
		href: string;
		items: Song[];
		limit: number;
		next: string;
		offset: number;
		previous: string;
		total: number;
	};
}
export enum AlbumActionTypes {
	SET_ALBUMS = 'SET_ALBUMS',
	SELECT_ALBUM = 'SELECT_ALBUM',
}
interface SetAlbumAction {
	type: AlbumActionTypes.SET_ALBUMS;
	payload: { albumsArray: IAlbum[]; total: number; liked: boolean[] };
}
interface SelectAlbumAction {
	type: AlbumActionTypes.SELECT_ALBUM;
	payload: Album;
}
export type AlbumAction = SetAlbumAction | SelectAlbumAction;
