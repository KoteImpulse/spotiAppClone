import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	ReactNode,
	useEffect,
	useRef,
} from 'react';
import cn from 'classnames';
import styles from './MainLayout.module.scss';
import Head from 'next/head';
import Navbar from '../../components/NavbarComponents/Navbar/Navbar';
import { useTranslation } from 'next-i18next';
import Topbar from '../../components/TopbarComponents/Topbar/Topbar';
import Playerbar from '../../components/PlayerbarComponents/Playerbar/Playerbar';
import EditPlaylistModal from '../../components/Modals/EditPlaylistModal/EditPlaylistModal';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { modalEditClose } from '../../lib/helper';

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
	const { editModalState } = useTypedSelector((state) => state.client);
	const { setEditModalState } = useActions();
	const refModal = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function clickHandler(event: any) {
			if (!refModal) return;
			if (editModalState.isOpened === true) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setEditModalState({...modalEditClose});
				}
			}
		}

		window.addEventListener('click', clickHandler);
		return () => {
			window.removeEventListener('click', clickHandler);
		};
	}, [setEditModalState, editModalState]);

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
					<div className={cn(styles.mainview)}>{children}</div>
					<div
						aria-label={t('playingbar.ariaLabel')}
						className={cn(styles.playingbar)}
					>
						<Playerbar />
					</div>
				</div>
			</div>
			{editModalState.isOpened && <EditPlaylistModal ref={refModal} />}
		</>
	);
};

export default MainLayout;
