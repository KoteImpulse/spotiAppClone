import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import MainLayout from '../../layout/Main/MainLayout';
import { wrapper } from '../../store';
import MainviewLayout from '../../layout/MainviewLayout/MainviewLayout';
import { setAlbums } from '../../store/action-creators/album';
import { getSession } from 'next-auth/react';
import AlbumsSection from '../../components/MainViewComponents/Sections/AlbumsSection/AlbumsSection';
import { useEffect } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';

const Albums: NextPage = () => {
	const { t } = useTranslation('mainview');
	const { followingAlbums } = useTypedSelector((state) => state.server);

	useEffect(() => {}, [followingAlbums]);

	return (
		<MainLayout
			title={t('collection.albums.seoTitle')}
			description={t('collection.albums.seoDesc')}
		>
			<MainviewLayout>
				<AlbumsSection albumsArray={followingAlbums} />
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
					const albums = await fetch(
						`https://api.spotify.com/v1/me/albums?limit=50`,
						{
							headers: {
								Authorization: `Bearer ${session?.user.accessToken}`,
							},
						}
					).then((res) => {
						return res ? res.json() : null;
					});
					if (albums?.items.length >= 0) {
						dispatch(setAlbums(albums.items));
					}
				}
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
			} catch (e: any) {
				dispatch(setAlbums([]));
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
