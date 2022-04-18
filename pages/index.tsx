import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation,  } from 'next-i18next';
import { wrapper } from '../store';
import MainLayout from '../layout/Main/MainLayout';

const Home: NextPage = () => {
	const { t } = useTranslation('common');

	return (
		<MainLayout title={t('seoTitle')} description={t('seoDesc')}>
			<div>{t('mainText')}</div>
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

export default (Home);
