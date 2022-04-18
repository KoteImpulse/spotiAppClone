import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { getSession } from 'next-auth/react';
import MainLayout from '../layout/Main/MainLayout';
import { wrapper } from '../store';
import { setUser } from '../store/action-creators/user';
import { useTypedSelector } from '../hooks/useTypedSelector';

const User: NextPage = () => {
	const { t } = useTranslation('mainview');
	const { currentUser } = useTypedSelector((state) => state.server);
	// console.log(currentUser);
	return (
		<MainLayout
			title={t('collection.artists.seoTitle')}
			description={t('collection.artists.seoDesc')}
		>
			USER PAGE
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
				// redirect: {
				// 	destination: '/collection/playlists',
				// 	permanent: false,
				// },
			};
		}
);

export default User;
