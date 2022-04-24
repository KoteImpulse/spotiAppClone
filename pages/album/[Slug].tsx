import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import SelectedAlbum from '../../components/MainViewComponents/Album/SelectedAlbum';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import MainLayout from '../../layout/Main/MainLayout';
import MainviewLayout from '../../layout/MainviewLayout/MainviewLayout';
import { SpotiReq } from '../../lib/spotiReq';
import { wrapper } from '../../store';
import { selectAlbum } from '../../store/action-creators/album';
import { setArtistData } from '../../store/action-creators/artist';
import { setSongs } from '../../store/action-creators/song';
import { Song, Track } from '../../types/song';

interface AlbumPageProps {
	isLiked: boolean;
}

const AlbumPage: NextPage<AlbumPageProps> = ({ isLiked }) => {
	const { t } = useTranslation('mainview');
	const { selectedAlbum } = useTypedSelector((state) => state.server);

	return (
		<MainLayout
			title={t('albumPage.seoTitle') + `${selectedAlbum?.name}`}
			description={t(`albumPage.seoDesc`) + `${selectedAlbum?.name}`}
		>
			<MainviewLayout>
				<SelectedAlbum albumIsLiked={isLiked} />
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
					const album = await fetch(
						`https://api.spotify.com/v1/albums/${slug}`,
						{
							headers: {
								Authorization: `Bearer ${session?.user.accessToken}`,
							},
						}
					).then((res) => (res ? res.json() : null));

					const tracks = await SpotiReq()
						.getAlbumTracks(slug, 50, 0, session?.user.accessToken)
						.then((res) => (res ? res.json() : []));
					const ids =
						tracks?.items?.map((item: Song) => item.id).join(',') ||
						'';
					dispatch(selectAlbum(album));
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
					const artistAlbums = await SpotiReq()
						.getArtistAlbums(
							album.artists[0].id,
							8,
							0,
							session?.user.accessToken
						)
						.then((res) => (res ? res.json() : null));
					dispatch(
						setArtistData({
							songsArray: [],
							liked: [],
							albums: artistAlbums.items,
							relatedArtists: [],
						})
					);

					const isLiked = await SpotiReq()
						.checkSavedAlbum(slug, session?.user.accessToken)
						.then((res) => (res ? res.json() : []));
					return {
						props: {
							session,
							isLiked: isLiked[0],
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

export default AlbumPage;
