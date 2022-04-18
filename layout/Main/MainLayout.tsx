import React, { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import styles from './MainLayout.module.scss';
import Head from 'next/head';
import Navbar from '../../components/NavbarComponents/Navbar/Navbar';
import { useTranslation } from 'next-i18next';
import Topbar from '../../components/TopbarComponents/Topbar/Topbar';
import Playerbar from '../../components/PlayerbarComponents/Playerbar/Playerbar';

interface MainLayoutProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children: ReactNode;
	title?: string;
	description?: string;
	keywords?: string;
}

const MainLayout: FC<MainLayoutProps> = ({
	keywords,
	description,
	title,
	className,
	children,
	...props
}) => {
	const { t } = useTranslation('common');

	return (
		<>
			<Head>
				<title>{title || 'Project'}</title>
				<meta name='description' content={`${description}`} />
				<meta
					name='keywords'
					content={keywords || 'site, music, audio, listen, app'}
				/>
			</Head>
			<div className={styles.container} {...props}>
				<div className={styles.mainLayout}>
					<div
						aria-label={t('topbar.ariaLabel')}
						className={cn(styles.topbar)}
					>
						<Topbar />
					</div>
					<nav
						aria-label={t('navbar.ariaLabel')}
						className={cn(styles.navbar)}
					>
						<Navbar />
					</nav>
					<div
						// aria-label={t('mainview.ariaLabel')}
						className={cn(styles.mainview)}
					>
						{children}
					</div>
					<div
						aria-label={t('playingbar.ariaLabel')}
						className={cn(styles.playingbar)}
					>
						<Playerbar />
					</div>
				</div>
			</div>
		</>
	);
};

export default MainLayout;
