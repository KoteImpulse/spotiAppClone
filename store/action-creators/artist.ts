import { Artist, ArtistAction, ArtistActionTypes } from '../../types/artist';

export const setArtists = (payload: Artist[]): ArtistAction => {
	return { type: ArtistActionTypes.SET_ARTISTS, payload };
};
export const selectArtist = (payload: Artist): ArtistAction => {
	return { type: ArtistActionTypes.SELECT_ARTIST, payload };
};
