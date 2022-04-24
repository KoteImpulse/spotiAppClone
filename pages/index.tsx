import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { wrapper } from '../store';
import MainLayout from '../layout/Main/MainLayout';
import { getSession, useSession } from 'next-auth/react';
import MainviewLayout from '../layout/MainviewLayout/MainviewLayout';
import Main from '../components/MainViewComponents/Main/Main';
import { SpotiReq } from '../lib/spotiReq';
import { useEffect, useMemo } from 'react';

interface HomeProps {
	arrayPlaylists: any;
	featuredPlaylists: any;
	categories: any;
	newReleases: any;
	releasRadar: any;
	discoverWeekly: any;
	topArtists: any;
}

const Home: NextPage<HomeProps> = ({
	featuredPlaylists,
	releasRadar,
	discoverWeekly,
	topArtists,
	newReleases,
	categories,
	arrayPlaylists,
}) => {
	const { t } = useTranslation('mainview');
	const { data: session } = useSession();

	return (
		<MainLayout
			title={t('mainPage.seoTitle')}
			description={t(`mainPage.seoDesc`)}
		>
			<MainviewLayout>
				<Main
					playlists={arrayPlaylists}
					category={categories}
					featuredPlaylists={featuredPlaylists}
					newReleases={newReleases}
					releasRadar={releasRadar}
					discoverWeekly={discoverWeekly}
					topArtists={topArtists}
				/>
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
				const arrayPlaylists = [];
				if (session) {
					const categories = [
						{ id: 'chill', name: 'Chill' },
						{ id: 'mood', name: 'Mood' },
						{ id: 'decades', name: 'Decades' },
						{ id: 'workout', name: 'Workout' },
						{ id: 'radar', name: 'Radar' },
						{ id: 'toplists', name: 'Top Lists' },
					];
					for (let i = 0; i < categories.length; i++) {
						const element = categories[i];
						const playlists = await SpotiReq()
							.getCategoryPlaylist(
								element.id,
								8,
								0,
								session?.user.accessToken
							)
							.then((res) => (res ? res.json() : []));
						arrayPlaylists.push(playlists);
					}
					const featuredPlaylists = await SpotiReq()
						.getFeaturedPlaylists(8, 0, session?.user.accessToken)
						.then((res) => (res ? res.json() : []));
					const newReleases = await SpotiReq()
						.getNewReleases(16, 0, session?.user.accessToken)
						.then((res) => (res ? res.json() : []));
					const releasRadar = await SpotiReq()
						.search(
							'release radar',
							1,
							0,
							session?.user.accessToken
						)
						.then((res) => (res ? res.json() : []));
					const discoverWeekly = await SpotiReq()
						.search(
							'discover weekly',
							1,
							0,
							session?.user.accessToken
						)
						.then((res) => (res ? res.json() : []));
					const topArtists = await SpotiReq()
						.getUserTopArtists(8, 0, session?.user.accessToken)
						.then((res) => (res ? res.json() : []));

					return {
						props: {
							session,
							categories,
							arrayPlaylists,
							featuredPlaylists,
							newReleases,
							releasRadar,
							discoverWeekly,
							topArtists,
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

export default Home;
