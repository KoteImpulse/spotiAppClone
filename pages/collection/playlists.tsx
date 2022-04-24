import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import MainLayout from '../../layout/Main/MainLayout';
import { wrapper } from '../../store';
import MainviewLayout from '../../layout/MainviewLayout/MainviewLayout';
import PlaylistsSection from '../../components/MainViewComponents/Sections/PlaylistsSection/PlaylistsSection';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { getSession } from 'next-auth/react';

interface PlaylistsProps {}

const Playlists: NextPage<PlaylistsProps> = ({}) => {
	const { t } = useTranslation('mainview');
	const { userPlaylists } = useTypedSelector((state) => state.server);

	return (
		<MainLayout
			title={t('collection.playlists.seoTitle')}
			description={t('collection.playlists.seoDesc')}
		>
			<MainviewLayout
				total={userPlaylists.total}
				array={userPlaylists.playlistsArray}
			>
				<PlaylistsSection
					playlistsArray={userPlaylists.playlistsArray}
					usage='collectionPlaylist'
				/>
			</MainviewLayout>
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context: any): Promise<any> => {
			try {
				const session = await getSession(context);
				if (session) {
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

export default Playlists;
function dispatch(arg0: any) {
	throw new Error('Function not implemented.');
}
