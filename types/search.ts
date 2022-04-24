import { Playlist } from './playlist';
import { Album } from './album';
import { Artist } from './artist';
import { Song } from './song';

export interface ISearchResult {
	artists: {
		href: string;
		items: Artist[];
		limit: number;
		next: string | null;
		offset: number;
		previous: string;
		total: number;
	};
	albums: {
		href: string;
		items: Album[];
		limit: number;
		next: string | null;
		offset: number;
		previous: string;
		total: number;
	};
	tracks: {
		href: string;
		items: Song[];
		limit: number;
		next: string | null;
		offset: number;
		previous: string;
		total: number;
	};
	playlists: {
		href: string;
		items: Playlist[];
		limit: number;
		next: string | null;
		offset: number;
		previous: string;
		total: number;
	};
}

export enum SearchActionTypes {
	SET_SEARCH_DATA = 'SET_SEARCH_DATA',
}
interface SetSearchDataAction {
	type: SearchActionTypes.SET_SEARCH_DATA;
	payload: ISearchResult;
}
export type SearchAction = SetSearchDataAction;
