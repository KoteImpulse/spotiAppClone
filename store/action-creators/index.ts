import * as PlayerActionCreators from './player';
import * as PlaylistActionCreators from './playlist';
import * as ClientActionCreators from './client';
import * as UserActionCreators from './user';
import * as AlbumActionCreators from './album';
import * as ArtistActionCreators from './artist';
import * as SongActionCreators from './song';

export default {
	...PlayerActionCreators,
	...PlaylistActionCreators,
	...ClientActionCreators,
	...UserActionCreators,
	...AlbumActionCreators,
	...ArtistActionCreators,
	...SongActionCreators,
};
