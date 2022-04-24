import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { wrapper } from '../store';
import MainLayout from '../layout/Main/MainLayout';
import { getSession } from 'next-auth/react';
import MainviewLayout from '../layout/MainviewLayout/MainviewLayout';
import { SpotiReq } from '../lib/spotiReq';
import { setLikedTracks } from '../store/action-creators/likedTrack';
import { useTypedSelector } from '../hooks/useTypedSelector';
import LikedTracks from '../components/MainViewComponents/LikedTracks/LikedTracks';
import { Track } from '../types/song';

interface CollectionLikesProps {}

const CollectionLikes: NextPage<CollectionLikesProps> = ({}) => {
	const { t } = useTranslation('mainview');
	const { likedTracks } = useTypedSelector((state) => state.server);

	return (
		<MainLayout
			title={t('likedTracksPage.seoTitle')}
			description={t(`likedTracksPage.seoDesc`)}
		>
			<MainviewLayout
				array={likedTracks.songsArray}
				total={likedTracks.total}
			>
				<LikedTracks />
			</MainviewLayout>
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context: any): Promise<any> => {
			const dispatch = store.dispatch;
			try {
				const session = await getSession(context);
				if (session) {
					const tracks = await SpotiReq()
						.getLikedTracks(50, 0, session?.user.accessToken)
						.then((res) => (res ? res.json() : null));
					const ids =
						tracks?.items
							?.map((item: Track) => item.track.id)
							.join(',') || '';
					const likedSongs = await SpotiReq()
						.checkSavedTracks(ids, session?.user.accessToken)
						.then((res) => (res ? res.json() : []));
					dispatch(
						setLikedTracks({
							songsArray: tracks.items,
							total: tracks.total,
							liked: likedSongs,
						})
					);
					return {
						props: {
							session,
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
			} catch (e) {
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
				};
			}
		}
);

export default CollectionLikes;
