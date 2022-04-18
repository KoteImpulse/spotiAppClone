import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useRef,
} from 'react';
import cn from 'classnames';
import styles from './Topbar.module.scss';
import { useTranslation } from 'next-i18next';
import TopbarButtonsBlock from '../TopbarButtonsBlock/TopbarButtonsBlock';
import TopbarCenterBlock from '../TopbarCenterBlock/TopbarCenterBlock';
import ProfileButton from '../../Buttons/ProfileButton/ProfileButton';
import { IoPersonCircleOutline, IoCaretDownOutline } from 'react-icons/io5';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { useRouter } from 'next/router';
import TopbarModal from '../../Modals/TopbarModal/TopbarModal';

interface TopbarProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

interface ILinkObject {
	[index: string]: string;
}

const Topbar: FC<TopbarProps> = ({ className, ...props }) => {
	const { t } = useTranslation('topbar');
	const { topbarModalState } = useTypedSelector((state) => state.client);
	const { setTopbarModalState } = useActions();
	const refButton = useRef<HTMLButtonElement>(null);
	const refModal = useRef<HTMLDivElement>(null);
	const { asPath } = useRouter();

	useEffect(() => {
		if (!refModal || !refButton) return;

		function handleClick(event: any) {
			if (refModal.current && !refModal.current.contains(event.target)) {
				if (
					refButton.current &&
					refButton.current.contains(event.target)
				) {
				} else {
					setTopbarModalState(false);
				}
			}
		}
		window.addEventListener('click', handleClick);

		return () => window.removeEventListener('click', handleClick);
	}, [refModal, refButton]);

	const colorVariants: ILinkObject = {
		'/collection/playlists': 'var(--background-navbar)',
		'/': 'var(--background-navbar)',
		'/search': 'var(--background-navbar)',
		'/collection/albums': 'var(--background-navbar)',
		'/collection/artists': 'var(--background-navbar)',
	};

	return (
		<header
			aria-label={t('ariaLabelMain')}
			className={cn(className, styles.topbar)}
			{...props}
		>
			<div
				className={styles.backgroundColorBlock}
				style={{ backgroundColor: colorVariants[asPath] }}
			>
				<div></div>
			</div>
			<TopbarButtonsBlock />
			<TopbarCenterBlock className={styles.contentBlock} />

			<ProfileButton
				ariaLabel={t('buttons.profileAria')}
				icon1={<IoPersonCircleOutline />}
				icon2={<IoCaretDownOutline />}
				onClick={() => setTopbarModalState(!topbarModalState)}
				ref={refButton}
			/>
			{topbarModalState && <TopbarModal ref={refModal} />}
		</header>
	);
};

export default React.memo(Topbar);
