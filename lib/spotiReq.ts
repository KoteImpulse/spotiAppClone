export const SpotiReq = () => ({
	//-------------ARTIST-----------
	async getArtist(id: string) {
		const response = await fetch(``);
		return response;
	},
	async getArtists(limit: number, token: string | undefined, after?: string) {
		const response = await fetch(
			!after
				? `https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`
				: `https://api.spotify.com/v1/me/following?type=artist&after=${after}&limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getArtistAlbums(
		id: string,
		limit: number,
		offset: number,
		token: string | undefined
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/artists/${id}/albums?market=IN&limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getRelatedArtists(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/artists/${id}/related-artists`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getArtistTopTracks(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/artists/${id}/top-tracks?market=IT`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},

	async getUserFollowingArtist(token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/following?type=artist&limit=50`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async checkFollowArtist(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async unFollowArtist(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/following?type=artist&ids=${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'DELETE',
			}
		);
		return response;
	},
	async followArtist(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/following?type=artist&ids=${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'PUT',
			}
		);
		return response;
	},
	//-------------PLAYLIST-----------
	async createPlaylist(id: string) {
		const response = await fetch(``);
		return response;
	},
	async deletePlaylist(id: string) {
		const response = await fetch(``);
		return response;
	},
	async changeDetails(
		id: string,
		name: string,
		description: string,
		token: string | undefined
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/playlists/${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ name, description, public: false }),
				method: 'PUT',
			}
		);
		return response;
	},
	async addPlaylistToLibrary(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/playlists/${id}/followers`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'PUT',
			}
		);
		return response;
	},
	async removePlaylistFromLibrary(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/playlists/${id}/followers`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'DELETE',
			}
		);
		return response;
	},
	async getPlaylist(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/playlists/${id}?market=ES`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getUserPlaylists(
		limit: number,
		offset: number,
		token: string | undefined
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async checkFollowPlaylist(
		playlistId: string,
		userId: string,
		token: string | undefined
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/playlists/${playlistId}/followers/contains?ids=${userId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	//-------------ALBUM-----------
	async checkSavedAlbum(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/albums/contains?ids=${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async removeAlbum(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/albums?ids=${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'DELETE',
			}
		);
		return response;
	},
	async saveAlbum(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/albums?ids=${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'PUT',
			}
		);
		return response;
	},
	async getAlbums(limit: number, offset: number, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/albums?limit=${limit}&offset=${offset}&market=ES`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getAlbum(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/albums/${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	//-------------TRACKS-----------
	async getTracks(
		id: string,
		limit: number,
		offset: number,
		token: string | undefined
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/playlists/${id}/tracks?limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getTrack(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/tracks/${id}?market=ES`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getAlbumTracks(
		id: string,
		limit: number,
		offset: number,
		token: string | undefined
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/albums/${id}/tracks?market=ES&limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getLikedTracks(
		limit: number,
		offset: number,
		token: string | undefined
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async checkSavedTracks(ids: string[], token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async removeFromLiked(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/tracks?ids=${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'DELETE',
			}
		);
		return response;
	},
	async addToLiked(id: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/tracks?ids=${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'PUT',
			}
		);
		return response;
	},
	async addToPlaylist(id: string, uri: string, token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/playlists/${id}/tracks?uris=${uri}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'POST',
			}
		);
		return response;
	},
	async removeFromPlaylist(
		id: string,
		uri: string,
		token: string | undefined
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/playlists/${id}/tracks`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'DELETE',
				body: JSON.stringify({
					tracks: [{ uri }],
				}),
			}
		);
		return response;
	},
	//-------------BROWSE-----------
	async getRecommendation(
		id: string,
		limit: number,
		token: string | undefined,
		type: string
	) {
		const response = await fetch(
			type === 'song'
				? `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_tracks=${id}`
				: type === 'artist'
				? `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_artists=${id}`
				: `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_artists=${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getCategories(
		limit: number,
		offset: number,
		token: string | undefined
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/browse/categories?limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getCategoryPlaylist(
		id: string,
		limit: number,
		offset: number,
		token: string | undefined,
		country = 'KR'
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/browse/categories/${id}/playlists?country=${country}&limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getFeaturedPlaylists(
		limit: number,
		offset: number,
		token: string | undefined,
		country = 'KR'
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/browse/featured-playlists?country=${country}&limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getNewReleases(
		limit: number,
		offset: number,
		token: string | undefined,
		country = 'KR'
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/browse/new-releases?country=${country}&limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async search(
		q: string,
		limit: number,
		offset: number,
		token: string | undefined,
		country = 'KR'
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/search?q=${q}&type=track%2Cartist%2Cplaylist%2Calbum&market=${country}&limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
	async getUserTopArtists(
		limit: number,
		offset: number,
		token: string | undefined
	) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},
});
