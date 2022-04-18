import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './NavbarLogoBlock.module.scss';
import { useTranslation } from 'next-i18next';

interface NavbarLogoBlockProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const NavbarLogoBlock: FC<NavbarLogoBlockProps> = ({ className, ...props }) => {
	const { t } = useTranslation('navbar');

	return (
		<div className={cn(className, styles.logo)} {...props}>
			<span aria-label={t('logoAria')} className={styles.logoContainer}>
				<span className={styles.logoText}>{t('logoText')}</span>
			</span>
		</div>
	);
};

export default React.memo(NavbarLogoBlock);
