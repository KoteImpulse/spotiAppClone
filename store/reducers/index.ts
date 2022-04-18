import { LikedTracks, LikedTracksActionTypes } from './../../types/likedTrack';
import { Album, AlbumActionTypes, IAlbum } from './../../types/album';
import { Artist, ArtistActionTypes } from './../../types/artist';
import {
	ClientActionTypes,
	ICollectionAlbumModal,
	ICollectionArtistModal,
	ICollectionPlaylistModal,
	INavbarModal,
	ISongModal,
} from './../../types/client';
import { PlaylistActionTypes } from './../../types/playlist';
import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { Playlist } from '../../types/playlist';
import { User, UserActionTypes } from '../../types/user';
import { SongActionTypes, Track } from '../../types/song';

export interface State {
	client: {
		historyPages: string[];
		currentPage: number;
		backIsPressed: boolean;
		forwardIsPressed: boolean;
		topbarModalState: boolean;
		navbarModalState: INavbarModal;
		collectionPlaylistState: ICollectionPlaylistModal;
		collectionAlbumState: ICollectionAlbumModal;
		collectionArtistState: ICollectionArtistModal;
		songModalState: ISongModal;
	};
	server: {
		userPlaylists: Playlist[];
		selectedPlaylist: Playlist | null;
		currentUser: User | null;
		followingArtists: Artist[];
		selectedArtist: Artist | null;
		followingAlbums: IAlbum[];
		selectedAlbum: Album | null;
		likedTracks: LikedTracks | null;
		songs: { songsArray: Track[]; liked: boolean[]; total: number };
	};
}

const initialState: State = {
	client: {
		historyPages: [] as string[],
		currentPage: 0,
		backIsPressed: false,
		forwardIsPressed: false,
		topbarModalState: false,
		navbarModalState: {
			isOpened: false,
			playlistId: '',
			x: 0,
			y: 0,
		} as INavbarModal,
		collectionPlaylistState: {
			isOpened: false,
			playlistId: '',
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			inLibrary: false,
		} as ICollectionPlaylistModal,
		collectionAlbumState: {
			isOpened: false,
			albumId: '',
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			inLibrary: false,
		} as ICollectionAlbumModal,
		collectionArtistState: {
			isOpened: false,
			artistId: '',
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			inLibrary: false,
		} as ICollectionArtistModal,
		songModalState: {
			isOpened: false,
			songId: '',
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			inLibrary: false,
		} as ISongModal,
	},
	server: {
		userPlaylists: [],
		selectedPlaylist: null,
		currentUser: null,
		followingArtists: [],
		selectedArtist: null,
		followingAlbums: [],
		selectedAlbum: null,
		likedTracks: null,
		songs: { songsArray: [], liked: [], total: 0 },
	},
};

export const reducer = (state: State = initialState, action: AnyAction) => {
	switch (action.type) {
		//-----------------------SERVER STATE-------------------------//
		case HYDRATE:
			return {
				...state,
				server: {
					...state.server,
					...action.payload.server,
				},
			};
		case PlaylistActionTypes.SELECT_PLAYLIST:
			return {
				...state,
				server: {
					...state.server,
					selectedPlaylist: action.payload,
				},
			};
		case PlaylistActionTypes.SET_PLAYLIST:
			return {
				...state,
				server: {
					...state.server,
					userPlaylists: action.payload,
				},
			};
		case UserActionTypes.SET_USER:
			return {
				...state,
				server: {
					...state.server,
					currentUser: action.payload,
				},
			};
		case ArtistActionTypes.SET_ARTISTS:
			return {
				...state,
				server: {
					...state.server,
					followingArtists: action.payload,
				},
			};
		case ArtistActionTypes.SELECT_ARTIST:
			return {
				...state,
				server: {
					...state.server,
					selectedArtist: action.payload,
				},
			};
		case AlbumActionTypes.SET_ALBUMS:
			return {
				...state,
				server: {
					...state.server,
					followingAlbums: action.payload,
				},
			};
		case AlbumActionTypes.SELECT_ALBUM:
			return {
				...state,
				server: {
					...state.server,
					selectedAlbum: action.payload,
				},
			};
		case LikedTracksActionTypes.SET_LIKED_TRACKS:
			return {
				...state,
				server: {
					...state.server,
					likedTracks: action.payload,
				},
			};
		case SongActionTypes.SET_SONGS:
			return {
				...state,
				server: {
					...state.server,
					songs: {
						songsArray: [
							...state.server.songs.songsArray,
							...action.payload.songsArray,
						],
						liked: [
							...state.server.songs.liked,
							...action.payload.liked,
						],
						total: action.payload.total,
					},
				},
			};

		//-----------------------CLENT STATE-------------------------//

		case ClientActionTypes.SET_HISTORY_PAGES:
			return {
				...state,
				client: {
					...state.client,
					historyPages: action.payload,
				},
			};
		case ClientActionTypes.SET_CURRENT_PAGE:
			return {
				...state,
				client: {
					...state.client,
					currentPage: action.payload,
				},
			};
		case ClientActionTypes.SET_BACK_IS_PRESSED:
			return {
				...state,
				client: {
					...state.client,
					backIsPressed: action.payload,
				},
			};
		case ClientActionTypes.SET_FORWARD_IS_PRESSED:
			return {
				...state,
				client: {
					...state.client,
					forwardIsPressed: action.payload,
				},
			};
		case ClientActionTypes.SET_TOPBAR_MODAL_STATE:
			return {
				...state,
				client: {
					...state.client,
					topbarModalState: action.payload,
				},
			};
		case ClientActionTypes.SET_NAVBAR_MODAL_STATE:
			return {
				...state,
				client: {
					...state.client,
					navbarModalState: action.payload,
				},
			};
		case ClientActionTypes.SET_COLLECTION_PLAYLIST_MODAL_STATE:
			return {
				...state,
				client: {
					...state.client,
					collectionPlaylistState: action.payload,
				},
			};
		case ClientActionTypes.SET_COLLECTION_ALBUM_MODAL_STATE:
			return {
				...state,
				client: {
					...state.client,
					collectionAlbumState: action.payload,
				},
			};
		case ClientActionTypes.SET_COLLECTION_ARTIST_MODAL_STATE:
			return {
				...state,
				client: {
					...state.client,
					collectionArtistState: action.payload,
				},
			};
		case ClientActionTypes.SET_SONG_MODAL_STATE:
			return {
				...state,
				client: {
					...state.client,
					songModalState: action.payload,
				},
			};

		default:
			return state;
	}
};

export type RootState = ReturnType<typeof reducer>;
