import { useEffect, useState } from 'react';
import useSpotify from './useSpotify';

function useSongInfo() {
	const spotifyApi = useSpotify();
	const currentIdTrack = '';
	const [songInfo, setSongInfo] = useState(null);

	useEffect(() => {
		(async () => {
			if (currentIdTrack) {
				const trackInfo = await fetch(
					`https://api.spotify.com/v1/tracks/${currentIdTrack}`,
					{
						headers: {
							Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
						},
					}
				);
				const res = await trackInfo.json();
				setSongInfo(res);
			}
		})();
	}, [currentIdTrack, spotifyApi]);

	return songInfo;
}

export default useSongInfo;
