import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import MainLayout from '../../layout/Main/MainLayout';
import { wrapper } from '../../store';
import MainviewLayout from '../../layout/MainviewLayout/MainviewLayout';
import PlaylistsSection from '../../components/MainViewComponents/Sections/PlaylistsSection/PlaylistsSection';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';

const Playlists: NextPage = () => {
	const { t } = useTranslation('mainview');
	const { userPlaylists } = useTypedSelector((state) => state.server);

	useEffect(() => {}, [userPlaylists]);

	return (
		<MainLayout
			title={t('collection.playlists.seoTitle')}
			description={t('collection.playlists.seoDesc')}
		>
			<MainviewLayout>
				<PlaylistsSection playlistsArray={userPlaylists} />
			</MainviewLayout>
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (context: any): Promise<any> => {
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
);

export default Playlists;
