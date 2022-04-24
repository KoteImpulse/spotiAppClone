import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { getSession } from 'next-auth/react';
import MainLayout from '../layout/Main/MainLayout';
import { wrapper } from '../store';
import { useTypedSelector } from '../hooks/useTypedSelector';

interface NotFoundProps {}

const NotFound: NextPage<NotFoundProps> = () => {
	const { t } = useTranslation('mainview');
	const { currentUser } = useTypedSelector((state) => state.server);

	return (
		<MainLayout
			title={t('notFoundPage.seoTitle')}
			description={t('notFoundPage.seoDesc')}
		>
			NotFound
		</MainLayout>
	);
};

export const getStaticProps = wrapper.getStaticProps(
	(store) =>
		async (context: any): Promise<any> => {
			try {
				const session = await getSession(context);
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

export default NotFound;
