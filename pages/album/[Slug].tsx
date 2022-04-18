import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import MainLayout from '../../layout/Main/MainLayout';
import { wrapper } from '../../store';
import { selectAlbum } from '../../store/action-creators/album';

interface AlbumPageProps {}

const AlbumPage: NextPage<AlbumPageProps> = ({}) => {
	// const { t } = useTranslation('mainview');
	const { selectedAlbum } = useTypedSelector((state) => state.server);
	console.log(selectedAlbum);
	return (
		<MainLayout
			title={
				'sadasd'
				// t('playlistPage.seoTitle')
				// + `${selectedPlaylist?.name}`
			}
			description={
				'sadasd'
				// t(`playlistPage.seoDesc`)
				// + `${selectedPlaylist?.name}`
			}
		>
			<span style={{ marginTop: '200px', color: 'wheat' }}>
				{selectedAlbum?.name}
			</span>
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
					if (album?.error?.status == '404') {
						return {
							props: {
								...(await serverSideTranslations(
									context.locale,
									[
										'common',
										'navbar',
										'topbar',
										'mainview',
										'playerbar',
									]
								)),
							},
							redirect: {
								destination: '/',
								permanent: false,
							},
						};
					}
					dispatch(selectAlbum(album));
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
