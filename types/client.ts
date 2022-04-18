export enum ClientActionTypes {
	SET_HISTORY_PAGES = 'SET_HISTORY_PAGES',
	SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
	SET_BACK_IS_PRESSED = 'SET_BACK_IS_PRESSED',
	SET_FORWARD_IS_PRESSED = 'SET_FORWARD_IS_PRESSED',
	SET_TOPBAR_MODAL_STATE = 'SET_TOPBAR_MODAL_STATE',
	SET_NAVBAR_MODAL_STATE = 'SET_NAVBAR_MODAL_STATE',
	SET_COLLECTION_PLAYLIST_MODAL_STATE = 'SET_COLLECTION_PLAYLIST_MODAL_STATE',
	SET_COLLECTION_ALBUM_MODAL_STATE = 'SET_COLLECTION_ALBUM_MODAL_STATE',
	SET_COLLECTION_ARTIST_MODAL_STATE = 'SET_COLLECTION_ARTIST_MODAL_STATE',
	SET_SONG_MODAL_STATE = 'SET_SONG_MODAL_STATE',
}
export interface INavbarModal {
	isOpened: boolean;
	playlistId: string;
	x: number;
	y: number;
}
export interface ICollectionPlaylistModal {
	isOpened: boolean;
	playlistId: string;
	x: number;
	y: number;
	height: number | undefined;
	width: number | undefined;
	inLibrary: boolean;
}
export interface ICollectionAlbumModal {
	isOpened: boolean;
	albumId: string;
	x: number;
	y: number;
	height: number | undefined;
	width: number | undefined;
	inLibrary: boolean;
}
export interface ICollectionArtistModal {
	isOpened: boolean;
	artistId: string;
	x: number;
	y: number;
	height: number | undefined;
	width: number | undefined;
	inLibrary: boolean;
}
export interface ISongModal {
	isOpened: boolean;
	songId: string;
	x: number;
	y: number;
	height: number | undefined;
	width: number | undefined;
	inLibrary: boolean;
}

interface SetHistoryPageAction {
	type: ClientActionTypes.SET_HISTORY_PAGES;
	payload: string[];
}
interface SetCurrentPageAction {
	type: ClientActionTypes.SET_CURRENT_PAGE;
	payload: number;
}
interface BackIsPressedAction {
	type: ClientActionTypes.SET_BACK_IS_PRESSED;
	payload: boolean;
}
interface ForwardIsPressedAction {
	type: ClientActionTypes.SET_FORWARD_IS_PRESSED;
	payload: boolean;
}
interface SetTopbarModalStateAction {
	type: ClientActionTypes.SET_TOPBAR_MODAL_STATE;
	payload: boolean;
}
interface SetNavbarModalStateAction {
	type: ClientActionTypes.SET_NAVBAR_MODAL_STATE;
	payload: INavbarModal;
}
interface SetCollectionPlaylistModalStateAction {
	type: ClientActionTypes.SET_COLLECTION_PLAYLIST_MODAL_STATE;
	payload: ICollectionPlaylistModal;
}
interface SetCollectionAlbumModalStateAction {
	type: ClientActionTypes.SET_COLLECTION_ALBUM_MODAL_STATE;
	payload: ICollectionAlbumModal;
}
interface SetCollectionArtistModalStateAction {
	type: ClientActionTypes.SET_COLLECTION_ARTIST_MODAL_STATE;
	payload: ICollectionArtistModal;
}
interface SetSongModalStateAction {
	type: ClientActionTypes.SET_SONG_MODAL_STATE;
	payload: ISongModal;
}

export type ClientAction =
	| SetHistoryPageAction
	| SetCurrentPageAction
	| BackIsPressedAction
	| ForwardIsPressedAction
	| SetTopbarModalStateAction
	| SetNavbarModalStateAction
	| SetCollectionPlaylistModalStateAction
	| SetCollectionAlbumModalStateAction
	| SetCollectionArtistModalStateAction
	| SetSongModalStateAction;
