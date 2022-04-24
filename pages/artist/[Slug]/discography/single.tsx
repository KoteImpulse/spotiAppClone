import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation,  } from 'next-i18next';
import MainLayout from '../../../../layout/Main/MainLayout';
import { wrapper } from '../../../../store';
import { getSession } from 'next-auth/react';


const DiscographySingle: NextPage = () => {
	const { t } = useTranslation('common');

	return (
		<MainLayout title={t('seoTitle')} description={t('seoDesc')}>
			<div>DiscographySingle</div>
		</MainLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
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

export default (DiscographySingle);
