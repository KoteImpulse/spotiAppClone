const SpotifyWebApi = require('spotify-web-api-node');

const scope = [
	'playlist-modify-public',
	'playlist-modify-private',
	'playlist-read-private',
	'playlist-read-collaborative',
	'app-remote-control',
	'streaming',
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'user-read-recently-played',
	'user-top-read',
	'user-read-playback-position',
	'ugc-image-upload',
	'user-follow-modify',
	'user-follow-read',
	'user-library-modify',
	'user-library-read',
	'user-read-email',
	'user-read-private',
].join(',');

const params = {
	scope: scope,
};

export const queryParamString = new URLSearchParams(params);

export const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyAPI = new SpotifyWebApi({
	clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
	clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyAPI;
