import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import SelectedArtist from '../../components/MainViewComponents/Artist/SelectedArtist';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import MainLayout from '../../layout/Main/MainLayout';
import MainviewLayout from '../../layout/MainviewLayout/MainviewLayout';
import { SpotiReq } from '../../lib/spotiReq';
import { wrapper } from '../../store';
import {
	selectArtist,
	setArtistData,
} from '../../store/action-creators/artist';
import { Song } from '../../types/song';

interface AlbumPageProps {
	artistIsLiked: boolean;
}

const AlbumPage: NextPage<AlbumPageProps> = ({ artistIsLiked }) => {
	const { t } = useTranslation('mainview');
	const { selectedArtist } = useTypedSelector((state) => state.server);

	return (
		<MainLayout
			title={t('artistPage.seoTitle') + `${selectedArtist?.name}`}
			description={t(`artistPage.seoDesc`) + `${selectedArtist?.name}`}
		>
			<MainviewLayout>
				<SelectedArtist artistIsLiked={artistIsLiked} />
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
					const artist = await fetch(
						`https://api.spotify.com/v1/artists/${slug}`,
						{
							headers: {
								Authorization: `Bearer ${session?.user.accessToken}`,
							},
						}
					).then((res) => (res ? res.json() : null));
					const isLiked = await SpotiReq()
						.checkFollowArtist(slug, session?.user.accessToken)
						.then((res) => (res ? res.json() : null));
					dispatch(selectArtist(artist));
					const artistTopSongs = await SpotiReq()
						.getArtistTopTracks(slug, session?.user.accessToken)
						.then((res) => (res ? res.json() : null));
					const artistAlbums = await SpotiReq()
						.getArtistAlbums(slug, 30, 0, session?.user.accessToken)
						.then((res) => (res ? res.json() : null));
					const relatedArtists = await SpotiReq()
						.getRelatedArtists(slug, session?.user.accessToken)
						.then((res) => (res ? res.json() : null));
					const ids =
						artistTopSongs?.tracks
							.map((item: Song) => item.id)
							.join(',') || '';
					const likedSongs = await SpotiReq()
						.checkSavedTracks(ids, session?.user.accessToken)
						.then((res) => (res ? res.json() : []));
					dispatch(
						setArtistData({
							songsArray: artistTopSongs.tracks,
							liked: likedSongs,
							albums: artistAlbums.items,
							relatedArtists: relatedArtists.artists,
						})
					);

					return {
						props: {
							session,
							artistIsLiked: isLiked[0],
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
				console.log(e, 'asd34234');
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
