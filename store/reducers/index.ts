import { LikedTracksActionTypes } from './../../types/likedTrack';
import { Album, AlbumActionTypes, IAlbum } from './../../types/album';
import { Artist, ArtistActionTypes } from './../../types/artist';
import {
	ClientActionTypes,
	ICollectionAlbumModal,
	ICollectionArtistModal,
	ICollectionPlaylistModal,
	IEditModal,
	INavbarModal,
	ISongData,
	ISongModal,
} from './../../types/client';
import { PlaylistActionTypes } from './../../types/playlist';
import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { Playlist } from '../../types/playlist';
import { User, UserActionTypes } from '../../types/user';
import { Song, SongActionTypes, Track } from '../../types/song';
import { ISearchResult, SearchActionTypes } from '../../types/search';

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
		shouldLoading: boolean;
		songData: ISongData;
		searchResults: ISearchResult;
		editModalState: IEditModal;
		currentSong: Song;
		isPlaying: boolean;
	};
	server: {
		userPlaylists: { playlistsArray: Playlist[]; total: number };
		selectedPlaylist: Playlist | null;
		currentUser: User | null;
		followingArtists: {
			artistsArray: Artist[];
			total: number;
			liked: boolean[];
		};
		selectedArtist: Artist | null;
		followingAlbums: {
			albumsArray: IAlbum[];
			total: number;
			liked: boolean[];
		};
		selectedAlbum: Album | null;
		likedTracks: { songsArray: Song[]; liked: boolean[]; total: number };
		songs: { songsArray: Track[]; liked: boolean[]; total: number };
		artistData: {
			songsArray: Song[];
			liked: boolean[];
			albums: Album[];
			relatedArtists: Artist[];
		};
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
			id: '',
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			inLibrary: false,
		} as ICollectionPlaylistModal,
		collectionAlbumState: {
			isOpened: false,
			id: '',
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			inLibrary: false,
		} as ICollectionAlbumModal,
		collectionArtistState: {
			isOpened: false,
			id: '',
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
		shouldLoading: false,
		songData: { songId: '', songURI: '' } as ISongData,
		searchResults: {} as ISearchResult,
		editModalState: {
			isOpened: false,
			id: '',
			name: '',
			description: '',
			image: '',
		} as IEditModal,
		currentSong: {} as Song,
		isPlaying: false,
	},
	server: {
		userPlaylists: { playlistsArray: [], total: 0 },
		selectedPlaylist: null,
		currentUser: null,
		followingArtists: { artistsArray: [], total: 0, liked: [] },
		selectedArtist: null,
		followingAlbums: { albumsArray: [], total: 0, liked: [] },
		selectedAlbum: null,
		likedTracks: { songsArray: [], liked: [], total: 0 },
		songs: { songsArray: [], liked: [], total: 0 },
		artistData: {
			songsArray: [],
			liked: [],
			albums: [],
			relatedArtists: [],
		},
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
					userPlaylists: {
						playlistsArray: [...action.payload.playlistsArray],
						total: action.payload.total,
					},
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
					followingArtists: {
						artistsArray: [...action.payload.artistsArray],
						liked: [...action.payload.liked],
						total: action.payload.total,
					},
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
					followingAlbums: {
						albumsArray: [...action.payload.albumsArray],
						liked: [...action.payload.liked],
						total: action.payload.total,
					},
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
					likedTracks: {
						songsArray: [...action.payload.songsArray],
						liked: [...action.payload.liked],
						total: action.payload.total,
					},
				},
			};
		case SongActionTypes.SET_SONGS:
			return {
				...state,
				server: {
					...state.server,
					songs: {
						songsArray: [...action.payload.songsArray],
						liked: [...action.payload.liked],
						total: action.payload.total,
					},
				},
			};
		case ArtistActionTypes.SET_ARTIST_DATA:
			return {
				...state,
				server: {
					...state.server,
					artistData: {
						songsArray: [
							...state.server.artistData.songsArray,
							...action.payload.songsArray,
						],
						liked: [
							...state.server.artistData.liked,
							...action.payload.liked,
						],
						albums: [
							...state.server.artistData.albums,
							...action.payload.albums,
						],
						relatedArtists: [
							...state.server.artistData.relatedArtists,
							...action.payload.relatedArtists,
						],
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
		case ClientActionTypes.SET_LOADING_CONTENT:
			return {
				...state,
				client: {
					...state.client,
					shouldLoading: action.payload,
				},
			};
		case ClientActionTypes.SET_SONG_DATA:
			return {
				...state,
				client: {
					...state.client,
					songData: action.payload,
				},
			};
		case SearchActionTypes.SET_SEARCH_DATA:
			return {
				...state,
				client: {
					...state.client,
					searchResults: action.payload,
				},
			};
		case ClientActionTypes.SET_EDIT_MODAL_STATE:
			return {
				...state,
				client: {
					...state.client,
					editModalState: action.payload,
				},
			};
		case ClientActionTypes.SET_CURRENT_SONG:
			return {
				...state,
				client: {
					...state.client,
					currentSong: action.payload,
				},
			};
		case ClientActionTypes.SET_IS_PLAYING:
			return {
				...state,
				client: {
					...state.client,
					isPlaying: action.payload,
				},
			};

		default:
			return state;
	}
};

export type RootState = ReturnType<typeof reducer>;
