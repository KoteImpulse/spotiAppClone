import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import MainLayout from '../../layout/Main/MainLayout';
import { wrapper } from '../../store';
import MainviewLayout from '../../layout/MainviewLayout/MainviewLayout';
import { setArtists } from '../../store/action-creators/artist';
import { getSession } from 'next-auth/react';
import ArtistsSection from '../../components/MainViewComponents/Sections/ArtistsSection/ArtistsSection';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { SpotiReq } from '../../lib/spotiReq';

interface ArtistProps {}

const Artists: NextPage<ArtistProps> = ({}) => {
	const { t } = useTranslation('mainview');
	const { followingArtists } = useTypedSelector((state) => state.server);

	return (
		<MainLayout
			title={t('collection.artists.seoTitle')}
			description={t('collection.artists.seoDesc')}
		>
			<MainviewLayout
				array={followingArtists.artistsArray}
				total={followingArtists.total}
			>
				<ArtistsSection
					artistsArray={followingArtists.artistsArray}
					usage='collectionArtists'
					headerText={t('collection.artists.header')}
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
				if (session) {
					const res = await SpotiReq()
						.getArtists(50, session?.user.accessToken)
						.then((res) => {
							return res ? res.json() : null;
						});
					if (res?.artists?.items.length >= 0) {
						dispatch(
							setArtists({
								artistsArray: res?.artists?.items,
								total: res?.artists?.total,
								liked: [],
							})
						);
					}
					return {
						props: {
							session,
							total: res?.artists?.total,
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
						session: await getSession(context),
						...(await serverSideTranslations(context.locale, [
							'common',
							'navbar',
							'topbar',
							'mainview',
							'playerbar',
						])),
					},
					// redirect: {
					// 	destination: '/collection/playlists',
					// 	permanent: false,
					// },
				};
			}
		}
);

export default Artists;
