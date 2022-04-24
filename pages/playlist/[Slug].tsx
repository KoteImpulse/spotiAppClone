import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import SelectedPlaylist from '../../components/MainViewComponents/Playlist/SelectedPlaylist';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import MainLayout from '../../layout/Main/MainLayout';
import MainviewLayout from '../../layout/MainviewLayout/MainviewLayout';
import { SpotiReq } from '../../lib/spotiReq';
import { wrapper } from '../../store';
import { selectPlaylist } from '../../store/action-creators/playlist';
import { setSongs } from '../../store/action-creators/song';
import { Track } from '../../types/song';

interface PlaylistPagePageProps {
	playlistIsLiked: boolean;
}

const PlaylistPage: NextPage<PlaylistPagePageProps> = ({ playlistIsLiked }) => {
	const { t } = useTranslation('mainview');
	const { selectedPlaylist, songs } = useTypedSelector(
		(state) => state.server
	);
	const { asPath } = useRouter();

	useEffect(() => {}, [asPath]);

	return (
		<MainLayout
			title={t('playlistPage.seoTitle') + `${selectedPlaylist?.name}`}
			description={
				t(`playlistPage.seoDesc`) + `${selectedPlaylist?.name}`
			}
		>
			<MainviewLayout array={songs.songsArray} total={songs.total}>
				<SelectedPlaylist playlistIsLiked={playlistIsLiked} />
			</MainviewLayout>
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context: any): Promise<any> => {
			const slug = context?.params.Slug;
			const dispatch = store.dispatch;
			try {
				const session = await getSession(context);
				if (session) {
					const playlist = await fetch(
						`https://api.spotify.com/v1/playlists/${slug}`,
						{
							headers: {
								Authorization: `Bearer ${session?.user.accessToken}`,
							},
						}
					).then((res) => (res ? res.json() : null));

					const tracks = await SpotiReq()
						.getTracks(slug, 50, 0, session?.user.accessToken)
						.then((res) => (res ? res.json() : []));
					const ids =
						tracks?.items
							?.map((item: Track) => item.track.id)
							.join(',') || '';
					dispatch(selectPlaylist(playlist));
					if (ids) {
						const likedSongs = await SpotiReq()
							.checkSavedTracks(ids, session?.user.accessToken)
							.then((res) => (res ? res.json() : []));
						dispatch(
							setSongs({
								songsArray: tracks.items,
								total: tracks.total,
								liked: likedSongs,
							})
						);
					}
					const isLiked = await SpotiReq()
						.checkFollowPlaylist(
							slug,
							session?.user?.username,
							session?.user.accessToken
						)
						.then((res) => (res ? res.json() : []));
					return {
						props: {
							session,
							playlistIsLiked: isLiked[0],
							...(await serverSideTranslations(context.locale, [
								'common',
								'navbar',
								'topbar',
								'mainview',
								'playerbar',
							])),
						},
					};
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
				return {
					props: {
						...(await serverSideTranslations(context.locale, [
							'common',
							'navbar',
							'topbar',
							'mainview',
							'playerbar',
						])),
					},
					redirect: {
						destination: '/',
						permanent: false,
					},
				};
			}
		}
);

export default PlaylistPage;
