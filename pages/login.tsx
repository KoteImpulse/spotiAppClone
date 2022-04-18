import React from 'react';
import { NextPage } from 'next';
import { wrapper } from '../store';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useTranslation,  } from 'next-i18next';
import Login from '../components/Login/Login';
import { getProviders } from 'next-auth/react';

interface LoginProps {
	providers: any;
}

const LoginPage: NextPage<LoginProps> = ({ providers }) => {
	const { t } = useTranslation('common');
	return (
		<>
			<Head>
				<title>{t('loginPage.seoTitle')}</title>
				<meta name='description' content={t('loginPage.seoDesc')} />
			</Head>
			<Login providers={providers} />
		</>
	);
};

export const getServerSideProps = wrapper.getStaticProps(
	(store) =>
		async (context: any): Promise<any> => {
			const providers = await getProviders();
			return {
				props: {
					providers,
					...(await serverSideTranslations(context.locale, [
						'common',
					])),
				},
			};
		}
);

export default LoginPage;
