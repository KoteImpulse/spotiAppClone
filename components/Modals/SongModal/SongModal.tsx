import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
} from 'react';
import cn from 'classnames';
import styles from './SongModal.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarModalButton from '../../Buttons/NavbarModalButton/NavbarModalButton';
import NavbarModalButtonList from '../../Buttons/NavbarModalButtonList/NavbarModalButtonList';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

interface SongModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	fetching: boolean;
	inLibrary: boolean;
	removeFromLikes: (a: string) => void;
	addToLikes: (a: string) => void;
	addToPlaylist: (a: string, b: string) => void;
	addQueue: (a: string) => void;
	toRadio: (a: string) => void;
}

const SongModal = (
	{
		fetching,
		inLibrary,
		className,
		addToPlaylist,
		removeFromLikes,
		addToLikes,
		addQueue,
		toRadio,
		...props
	}: SongModalProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');
	const { songModalState } = useTypedSelector((state) => state.client);

	return (
		<div className={cn(className, styles.songModal)} {...props} ref={ref}>
			<div className={styles.menu}>
				<div className={styles.content}>
					<ul className={styles.linksList}>
						<NavbarModalButton
							ariaLabel={t('playlistPage.modal.addQueueAria')}
							content={t('playlistPage.modal.addQueueText')}
							fetching={fetching}
						/>
						<NavbarModalButton
							ariaLabel={t('playlistPage.modal.toRadioAria')}
							content={t('playlistPage.modal.toRadioText')}
							fetching={fetching}
						/>
						<NavbarModalButton
							ariaLabel={t('playlistPage.modal.toArtistAria')}
							content={t('playlistPage.modal.toArtistText')}
							fetching={fetching}
						/>
						<NavbarModalButton
							ariaLabel={t('playlistPage.modal.toRadioAria')}
							content={t('playlistPage.modal.toRadioText')}
							fetching={fetching}
						/>
						{inLibrary ? (
							<NavbarModalButton
								ariaLabel={t(
									'playlistPage.modal.deleteSongFromLikesAria'
								)}
								content={t(
									'playlistPage.modal.deleteSongFromLikesText'
								)}
								fetching={fetching}
								onClick={() =>
									removeFromLikes(songModalState.songId)
								}
							/>
						) : (
							<NavbarModalButton
								ariaLabel={t(
									'playlistPage.modal.addSongToLikesAria'
								)}
								content={t(
									'playlistPage.modal.addSongToLikesText'
								)}
								fetching={fetching}
								onClick={() =>
									addToLikes(songModalState.songId)
								}
							/>
						)}
						<NavbarModalButtonList
							ariaLabel={t(
								'playlistPage.modal.addToPlaylistAria'
							)}
							content={t('playlistPage.modal.addToPlaylistText')}
							fetching={fetching}
							array
							addToPlaylist={addToPlaylist}
							parent={songModalState}
							usage="playlistSong"
						/>
						<NavbarModalButton
							ariaLabel={t('playlistPage.modal.shareAria')}
							content={t('playlistPage.modal.shareText')}
							fetching={fetching}
						/>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(SongModal);
