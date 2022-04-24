import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { wrapper } from '../store';
import MainLayout from '../layout/Main/MainLayout';
import { getSession } from 'next-auth/react';
import SearchComp from '../components/MainViewComponents/Search/SearchComp';
import MainviewLayout from '../layout/MainviewLayout/MainviewLayout';

interface SearchPageProps {}

const SearchPage: NextPage<SearchPageProps> = () => {
	const { t } = useTranslation('mainview');
	return (
		<MainLayout
			title={t('searchPage.seoTitle')}
			description={t('searchPage.seoDesc')}
		>
			<MainviewLayout>
				<SearchComp />
			</MainviewLayout>
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

export default SearchPage;
