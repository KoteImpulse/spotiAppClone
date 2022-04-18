import React, { DetailedHTMLProps, FC, HTMLAttributes, useMemo } from 'react';
import cn from 'classnames';
import styles from './CollectionBlock.module.scss';
import CollectionBlockLink from '../../../Links/CollectionBlockLink/CollectionBlockLink';
import { useTranslation } from 'next-i18next';

interface CollectionBlockProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

const CollectionBlock: FC<CollectionBlockProps> = ({ className, ...props }) => {
	const { t } = useTranslation('topbar');

	const navigationLinks = useMemo(
		() => [
			{
				href: '/collection/playlists',
				ariaLabel: `${t('content.collectionBlock.playlistsLinkAria')}`,
				content: `${t('content.collectionBlock.playlistsLinkText')}`,
			},
			{
				href: '/collection/albums',
				ariaLabel: `${t('content.collectionBlock.albumsLinkAria')}`,
				content: `${t('content.collectionBlock.albumsLinkText')}`,
			},
			{
				href: '/collection/artists',
				ariaLabel: `${t('content.collectionBlock.artistsLinkAria')}`,
				content: `${t('content.collectionBlock.artistsLinkText')}`,
			},
			// {
			// 	href: '/collection/stats',
			// 	ariaLabel: `${t('content.collectionBlock.tracksLinkAria')}`,
			// 	content: `${t('content.collectionBlock.tracksLinkText')}`,
			// },
		],
		[t]
	);
	return (
		<nav className={cn(className, styles.collectionBlock)} {...props}>
			<ul className={styles.navLinks}>
				{navigationLinks.map((item) => {
					return (
						<CollectionBlockLink
							key={item.href}
							ariaLabel={item.ariaLabel}
							href={item.href}
							content={item.content}
						/>
					);
				})}
			</ul>
		</nav>
	);
};

export default CollectionBlock;
