import React, { DetailedHTMLProps, FC, HTMLAttributes, useMemo } from 'react';
import cn from 'classnames';
import styles from './NavbarLinksBlock.module.scss';
import NavbarLink from '../../Links/NavbarLink/NavbarLink';
import {
	IoHomeOutline,
	IoLibraryOutline,
	IoSearchOutline,
} from 'react-icons/io5';
import { useTranslation } from 'next-i18next';

interface NavbarLinksBlockProps
	extends DetailedHTMLProps<
		HTMLAttributes<HTMLUListElement>,
		HTMLUListElement
	> {}

const NavbarLinksBlock: FC<NavbarLinksBlockProps> = ({
	className,
	...props
}) => {
	const { t } = useTranslation('navbar');
	

	const navigationLinks = useMemo(
		() => [
			{
				href: '/',
				ariaLabel: `${t('linksList.homeAria')}`,
				content: `${t('linksList.homeText')}`,
				icon: <IoHomeOutline />,
			},
			{
				href: '/search',
				ariaLabel: `${t('linksList.searchAria')}`,
				content: `${t('linksList.searchText')}`,
				icon: <IoSearchOutline />,
			},
			{
				href: '/collection/playlists',
				ariaLabel: `${t('linksList.libraryAria')}`,
				content: `${t('linksList.libraryText')}`,
				icon: <IoLibraryOutline />,
			},
		],
		[]
	);

	return (
		<ul className={cn(className, styles.linksList)} {...props}>
			{navigationLinks.map((item) => {
				return (
					<NavbarLink
						key={item.href}
						ariaLabel={item.ariaLabel}
						href={item.href}
						content={item.content}
						icon={item.icon}
					/>
				);
			})}
		</ul>
	);
};

export default NavbarLinksBlock;
