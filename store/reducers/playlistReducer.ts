import {
	PlaylistAction,
	PlaylistActionTypes,
	PlaylistState,
} from '../../types/playlist';

const initialState: PlaylistState = {
	userPlaylists: [],
};

// export const playlistReducer = (
// 	state = initialState,
// 	action: PlaylistAction
// ): PlaylistState => {
// 	switch (action.type) {
// 		case PlaylistActionTypes.SET_PLAYLIST:
// 			return { ...state, userPlaylists: action.payload };
// 		default:
// 			return state;
// 	}
// };
