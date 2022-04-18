export const SpotiReq = () => ({
	//-------------ARTIST-----------
	async getArtist(id: string) {
		const response = await fetch(``);
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
	async getPlaylist(id: string) {
		const response = await fetch(``);
		return response;
	},
	async getUserPlaylists(token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/playlists?offset=0&limit=50`,
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
	async getAlbums(token: string | undefined) {
		const response = await fetch(
			`https://api.spotify.com/v1/me/albums?limit=50`,
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
});
