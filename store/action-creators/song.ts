import { SongAction, SongActionTypes, Track } from '../../types/song';

export const setSongs = (payload: {
	songsArray: Track[];
	liked: boolean[];
	total: number;
}): SongAction => {
	return { type: SongActionTypes.SET_SONGS, payload };
};
export const selectSong = (payload: Track): SongAction => {
	return { type: SongActionTypes.SELECT_SONG, payload };
};
