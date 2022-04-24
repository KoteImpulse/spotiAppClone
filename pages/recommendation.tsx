import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { wrapper } from '../store';
import MainLayout from '../layout/Main/MainLayout';
import { getSession } from 'next-auth/react';
import MainviewLayout from '../layout/MainviewLayout/MainviewLayout';
import { SpotiReq } from '../lib/spotiReq';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { setSongs } from '../store/action-creators/song';
import { Song } from '../types/song';
import Recommendatios from '../components/MainViewComponents/Recommendatios/Recommendatios';

interface RecommendationProps {}

const Recommendation: NextPage<RecommendationProps> = ({}) => {
	const { t } = useTranslation('mainview');
	const { songs } = useTypedSelector((state) => state.server);

	return (
		<MainLayout
			title={t('recommendationPage.seoTitle')}
			description={t(`recommendationPage.seoDesc`)}
		>
			<MainviewLayout array={songs.songsArray} total={songs.total}>
				<Recommendatios />
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
						.getRecommendation(
							`${Object.values(context.query)[0]}`,
							20,
							session?.user.accessToken,
							`${Object.keys(context.query)[0]}`
						)
						.then((res) => (res ? res.json() : null));
					const ids =
						tracks?.tracks.map((item: Song) => item.id).join(',') ||
						'';
					const likedSongs = await SpotiReq()
						.checkSavedTracks(ids, session?.user.accessToken)
						.then((res) => (res ? res.json() : []));
					dispatch(
						setSongs({
							songsArray: tracks.tracks,
							total: tracks.tracks.length,
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

export default Recommendation;
