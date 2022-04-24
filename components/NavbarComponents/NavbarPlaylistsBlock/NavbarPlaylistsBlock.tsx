import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	MutableRefObject,
} from 'react';
import cn from 'classnames';
import styles from './NavbarPlaylistsBlock.module.scss';
import { useTranslation } from 'next-i18next';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import NavbarPlaylistItem from '../NavbarPlaylistItem/NavbarPlaylistItem';
import { Playlist } from '../../../types/playlist';

interface NavbarPlaylistsBlockProps
	extends DetailedHTMLProps<
		HTMLAttributes<HTMLUListElement>,
		HTMLUListElement
	> {}

const NavbarPlaylistsBlock = (
	{ className, ...props }: NavbarPlaylistsBlockProps,
	ref: ForwardedRef<Array<HTMLAnchorElement | null>>
): JSX.Element => {
	const { t } = useTranslation('navbar');
	const { userPlaylists } = useTypedSelector((state) => state.server);

	return (
		<>
			<ul
				className={cn(className, styles.navbarPlaylistsBlock)}
				{...props}
			>
				{userPlaylists &&
					userPlaylists?.playlistsArray.map((playlist: Playlist) => {
						return (
							<NavbarPlaylistItem
								key={playlist.id}
								name={playlist.name}
								href={playlist.id}
								ariaLabel={t('playlist.linkAria')}
								playlistId={playlist.id}
								ref={(el: HTMLAnchorElement) =>
									(
										ref as MutableRefObject<
											Array<HTMLAnchorElement | null>
										>
									).current.push(el)
								}
							/>
						);
					})}
			</ul>
			{!userPlaylists && <span>{t('errors.playlistEmptyError')}</span>}
		</>
	);
};

export default React.memo(forwardRef(NavbarPlaylistsBlock));
