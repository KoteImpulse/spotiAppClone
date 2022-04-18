import {
	ICollectionAlbumModal,
	ICollectionArtistModal,
	ISongModal,
} from './../../types/client';
import {
	ClientAction,
	ClientActionTypes,
	ICollectionPlaylistModal,
	INavbarModal,
} from '../../types/client';

export const setHistoryPages = (payload: string[]): ClientAction => {
	return { type: ClientActionTypes.SET_HISTORY_PAGES, payload };
};
export const setCurrentPage = (payload: number): ClientAction => {
	return { type: ClientActionTypes.SET_CURRENT_PAGE, payload };
};
export const setBackIsPressed = (payload: boolean): ClientAction => {
	return { type: ClientActionTypes.SET_BACK_IS_PRESSED, payload };
};
export const setForwardIsPressed = (payload: boolean): ClientAction => {
	return { type: ClientActionTypes.SET_FORWARD_IS_PRESSED, payload };
};
export const setTopbarModalState = (payload: boolean): ClientAction => {
	return { type: ClientActionTypes.SET_TOPBAR_MODAL_STATE, payload };
};
export const setNavbarModalState = (payload: INavbarModal): ClientAction => {
	return { type: ClientActionTypes.SET_NAVBAR_MODAL_STATE, payload };
};
export const setCollectionPlaylistModalState = (
	payload: ICollectionPlaylistModal
): ClientAction => {
	return {
		type: ClientActionTypes.SET_COLLECTION_PLAYLIST_MODAL_STATE,
		payload,
	};
};
export const setCollectionAlbumModalState = (
	payload: ICollectionAlbumModal
): ClientAction => {
	return {
		type: ClientActionTypes.SET_COLLECTION_ALBUM_MODAL_STATE,
		payload,
	};
};
export const setCollectionArtistModalState = (
	payload: ICollectionArtistModal
): ClientAction => {
	return {
		type: ClientActionTypes.SET_COLLECTION_ARTIST_MODAL_STATE,
		payload,
	};
};
export const setSongModalState = (payload: ISongModal): ClientAction => {
	return {
		type: ClientActionTypes.SET_SONG_MODAL_STATE,
		payload,
	};
};
