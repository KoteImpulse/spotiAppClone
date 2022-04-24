import {
	Artist,
	ArtistAction,
	ArtistActionTypes,
	ArtistData,
} from '../../types/artist';

export const setArtists = (payload: {
	artistsArray: Artist[];
	total: number;
	liked: boolean[];
}): ArtistAction => {
	return { type: ArtistActionTypes.SET_ARTISTS, payload };
};
export const selectArtist = (payload: Artist): ArtistAction => {
	return { type: ArtistActionTypes.SELECT_ARTIST, payload };
};
export const setArtistData = (payload: ArtistData): ArtistAction => {
	return { type: ArtistActionTypes.SET_ARTIST_DATA, payload };
};
