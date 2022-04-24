import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	useEffect,
} from 'react';
import cn from 'classnames';
import styles from './NavbarModal.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarModalButton from '../../Buttons/NavbarModalButton/NavbarModalButton';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Playlist } from '../../../types/playlist';
import { useSession } from 'next-auth/react';
import { useActions } from '../../../hooks/useActions';

interface NavbarModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	deletePlaylist: (a: string) => void;
	fetching: boolean;
	editPlaylist: (a: string) => void;
	addQueue?: (a: string) => void;
}

const NavbarModal = (
	{
		fetching,
		deletePlaylist,
		className,
		editPlaylist,
		addQueue,
		...props
	}: NavbarModalProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('navbar');
	const { navbarModalState } = useTypedSelector((state) => state.client);
	const { userPlaylists } = useTypedSelector((state) => state.server);
	const { setEditModalState } = useActions();
	const { data: session } = useSession();
	const myPlaylists = userPlaylists.playlistsArray.filter(
		(item: Playlist) => {
			return item.owner.id === session?.user.username;
		}
	);

	useEffect(() => {}, [userPlaylists]);

	return (
		<div className={cn(className, styles.navbarModal)} {...props} ref={ref}>
			<div className={styles.menu}>
				<div className={styles.content}>
					<ul className={styles.linksList}>
						<NavbarModalButton
							ariaLabel={t('navbarModal.deletePlaylistAria')}
							content={t('navbarModal.deletePlaylistText')}
							onClick={() =>
								deletePlaylist(navbarModalState.playlistId)
							}
							fetching={fetching}
						/>
						{myPlaylists.some(
							(item: Playlist) =>
								item.id === navbarModalState.playlistId
						) && (
							<NavbarModalButton
								ariaLabel={t('navbarModal.editPlaylistAria')}
								content={t('navbarModal.editPlaylistText')}
								fetching={fetching}
								onClick={() =>
									editPlaylist(navbarModalState.playlistId)
								}
							/>
						)}
						<NavbarModalButton
							ariaLabel={t('navbarModal.addQueueAria')}
							content={t('navbarModal.addQueueText')}
							fetching={fetching}
						/>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(NavbarModal);
