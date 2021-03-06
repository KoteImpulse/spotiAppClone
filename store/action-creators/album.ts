import {
	Album,
	AlbumAction,
	AlbumActionTypes,
	IAlbum,
} from '../../types/album';

export const setAlbums = (payload: {
	albumsArray: IAlbum[];
	total: number;
	liked: boolean[];
}): AlbumAction => {
	return { type: AlbumActionTypes.SET_ALBUMS, payload };
};
export const selectAlbum = (payload: Album): AlbumAction => {
	return { type: AlbumActionTypes.SELECT_ALBUM, payload };
};
