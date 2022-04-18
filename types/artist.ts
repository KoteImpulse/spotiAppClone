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

export enum ArtistActionTypes {
	SET_ARTISTS = 'SET_ARTISTS',
	SELECT_ARTIST = 'SELECT_ARTIST',
	SET_ARTIST_TRACKS = 'SET_ARTIST_TRACKS',
}
interface SetArtistsAction {
	type: ArtistActionTypes.SET_ARTISTS;
	payload: Artist[];
}
interface SelectArtistAction {
	type: ArtistActionTypes.SELECT_ARTIST;
	payload: Artist;
}
export type ArtistAction = SetArtistsAction | SelectArtistAction;
