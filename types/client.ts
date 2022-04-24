import { Song } from './song';

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
	SET_LOADING_CONTENT = 'SET_LOADING_CONTENT',
	SET_SONG_DATA = 'SET_SONG_DATA',
	SET_EDIT_MODAL_STATE = 'SET_EDIT_MODAL_STATE',
	SET_CURRENT_SONG = `SET_CURRENT_SONG`,
	SET_IS_PLAYING = `SET_IS_PLAYING`,
}
export interface INavbarModal {
	isOpened: boolean;
	playlistId: string;
	x: number;
	y: number;
}
export interface ICollectionPlaylistModal {
	isOpened: boolean;
	id: string;
	x: number;
	y: number;
	height: number | undefined;
	width: number | undefined;
	inLibrary: boolean;
}
export interface ICollectionAlbumModal {
	isOpened: boolean;
	id: string;
	x: number;
	y: number;
	height: number | undefined;
	width: number | undefined;
	inLibrary: boolean;
}
export interface ICollectionArtistModal {
	isOpened: boolean;
	id: string;
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
export interface ISongData {
	songId: string;
	songURI: string;
}
export interface IEditModal {
	isOpened: boolean;
	id: string;
	name: string;
	description: string;
	image: string;
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
interface SetLoadingContentAction {
	type: ClientActionTypes.SET_LOADING_CONTENT;
	payload: boolean;
}
interface SetSongDataAction {
	type: ClientActionTypes.SET_SONG_DATA;
	payload: ISongData;
}
interface SetEditModalStateAction {
	type: ClientActionTypes.SET_EDIT_MODAL_STATE;
	payload: IEditModal;
}
interface SetCurrentSongAction {
	type: ClientActionTypes.SET_CURRENT_SONG;
	payload: Song;
}
interface SetIsPlayingAction {
	type: ClientActionTypes.SET_IS_PLAYING;
	payload: boolean;
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
	| SetSongModalStateAction
	| SetLoadingContentAction
	| SetSongDataAction
	| SetEditModalStateAction
	| SetCurrentSongAction
	| SetIsPlayingAction;
