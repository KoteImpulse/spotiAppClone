import React, { DetailedHTMLProps, FC, HTMLAttributes, useEffect } from 'react';
import cn from 'classnames';
import styles from './TopbarButtonsBlock.module.scss';
import HeaderHistoryButton from '../../Buttons/HeaderHistoryButton/HeaderHistoryButton';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';

interface TopbarButtonsBlockProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const TopbarButtonsBlock: FC<TopbarButtonsBlockProps> = ({
	className,
	...props
}) => {
	const { t } = useTranslation('topbar');
	const router = useRouter();
	const { historyPages, currentPage, backIsPressed, forwardIsPressed } =
		useTypedSelector((state) => state.client);
	const {
		setHistoryPages,
		setCurrentPage,
		setBackIsPressed,
		setForwardIsPressed,
	} = useActions();

	const { pathname, asPath } = router;

	const changeLocale = () => {
		setHistoryPages([]);
		setCurrentPage(0);

		router.push({ pathname }, asPath, {
			locale: router.locale === 'ru' ? 'en' : 'ru',
		});
	};

	const backHandle = () => {
		if (currentPage === 0) {
			return;
		}
		setBackIsPressed(true);
		router.push(historyPages[currentPage - 1], undefined, {});
	};
	const forwardHandle = () => {
		if (currentPage + 1 === historyPages.length) {
			return;
		}
		setForwardIsPressed(true);
		router.push(historyPages[currentPage + 1], undefined, {});
	};

	useEffect(() => {
		if (backIsPressed) {
			setBackIsPressed(false);
			setCurrentPage(currentPage - 1);
		} else if (forwardIsPressed) {
			setForwardIsPressed(false);
			setCurrentPage(currentPage + 1);
		} else {
			setHistoryPages([
				...historyPages.slice(0, currentPage + 1),
				router.asPath,
			]);
			setCurrentPage(historyPages.slice(0, currentPage + 1).length);
		}
	}, [router.asPath]);

	return (
		<div className={cn(className, styles.topbarButtonsBlock)} {...props}>
			<HeaderHistoryButton
				className={styles.back}
				ariaLabel={t('buttons.backAria')}
				side={'left'}
				onClick={() => backHandle()}
				disabled={currentPage === 0 || historyPages.length === 0}
				style={
					currentPage === 0 || historyPages.length === 0
						? {
								cursor: 'not-allowed',
								backgroundColor: '#16151561',
						  }
						: { cursor: 'pointer' }
				}
			/>
			<HeaderHistoryButton
				className={styles.language}
				ariaLabel={t('buttons.language')}
				side={'none'}
				onClick={() => changeLocale()}
			/>

			<HeaderHistoryButton
				className={styles.forward}
				ariaLabel={t('buttons.forwardAria')}
				side={'right'}
				onClick={() => forwardHandle()}
				disabled={
					currentPage + 1 === historyPages.length ||
					historyPages.length === 0
				}
				style={
					historyPages.length === 0 ||
					currentPage + 1 === historyPages.length
						? {
								cursor: 'not-allowed',
								backgroundColor: '#16151561',
						  }
						: { cursor: 'pointer' }
				}
			/>
		</div>
	);
};

export default React.memo(TopbarButtonsBlock);
