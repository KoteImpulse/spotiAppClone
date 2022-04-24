import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import MainLayout from '../../layout/Main/MainLayout';
import { wrapper } from '../../store';
import MainviewLayout from '../../layout/MainviewLayout/MainviewLayout';
import { setAlbums } from '../../store/action-creators/album';
import { getSession } from 'next-auth/react';
import AlbumsSection from '../../components/MainViewComponents/Sections/AlbumsSection/AlbumsSection';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { SpotiReq } from '../../lib/spotiReq';

interface AlbumsProps {}

const Albums: NextPage<AlbumsProps> = ({}) => {
	const { t } = useTranslation('mainview');
	const { followingAlbums } = useTypedSelector((state) => state.server);

	return (
		<MainLayout
			title={t('collection.albums.seoTitle')}
			description={t('collection.albums.seoDesc')}
		>
			<MainviewLayout
				array={followingAlbums.albumsArray}
				total={followingAlbums.total}
			>
				<AlbumsSection
					albumsArray={followingAlbums.albumsArray}
					usage={'collectionAlbums'}
					headerText={t('collection.albums.header')}
					total={followingAlbums.total}
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
					const albums = await SpotiReq()
						.getAlbums(50, 0, session?.user.accessToken)
						.then((res) => {
							return res ? res.json() : null;
						});
					if (albums?.items.length >= 0) {
						dispatch(
							setAlbums({
								albumsArray: albums.items,
								total: albums.total,
								liked: [],
							})
						);
					}
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
					// redirect: {
					// 	destination: '/collection/playlists',
					// 	permanent: false,
					// },
				};
			}
		}
);

export default Albums;
