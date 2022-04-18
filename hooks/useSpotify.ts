const SpotifyWebApi = require('spotify-web-api-node');
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

const spotifyAPI = new SpotifyWebApi({
	clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
	clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

function useSpotify() {
	const { data: session } = useSession();

	useEffect(() => {
		if (session) {
			if (session.error === 'RefreshAccessTokenError') {
				signIn();
			}
			spotifyAPI.setAccessToken(session.user.accessToken);
		}
	}, [session]);

	return spotifyAPI;
}

export default useSpotify;
