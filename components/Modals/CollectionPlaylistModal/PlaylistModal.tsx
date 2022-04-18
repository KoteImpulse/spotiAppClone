import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
} from 'react';
import cn from 'classnames';
import styles from './PlaylistModal.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarModalButton from '../../Buttons/NavbarModalButton/NavbarModalButton';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

interface PlaylistModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	fetching: boolean;
	inLibrary: boolean;
	deletePlaylist: (a: string) => void;
	addPlaylistToLibrary: (a: string) => void;
	editPlaylist: (a: string) => void;
	addQueue: (a: string) => void;
	toRadio: (a: string) => void;
}

const PlaylistModal = (
	{
		fetching,
		inLibrary,
		addPlaylistToLibrary,
		deletePlaylist,
		className,
		editPlaylist,
		addQueue,
		toRadio,
		...props
	}: PlaylistModalProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');
	const { collectionPlaylistState } = useTypedSelector(
		(state) => state.client
	);
	return (
		<div
			className={cn(className, styles.playlistModal)}
			{...props}
			ref={ref}
		>
			<div className={styles.menu}>
				<div className={styles.content}>
					<ul className={styles.linksList}>
						{inLibrary ? (
							<NavbarModalButton
								ariaLabel={t(
									'collection.playlists.modal.deletePlaylistAria'
								)}
								content={t(
									'collection.playlists.modal.deletePlaylistText'
								)}
								onClick={() =>
									deletePlaylist(
										collectionPlaylistState.playlistId
									)
								}
								fetching={fetching}
							/>
						) : (
							<NavbarModalButton
								ariaLabel={t(
									'collection.playlists.modal.addPlaylistAria'
								)}
								content={t(
									'collection.playlists.modal.addPlaylistText'
								)}
								onClick={() =>
									addPlaylistToLibrary(
										collectionPlaylistState.playlistId
									)
								}
								fetching={fetching}
							/>
						)}
						<NavbarModalButton
							ariaLabel={t(
								'collection.playlists.modal.editPlaylistAria'
							)}
							content={t(
								'collection.playlists.modal.editPlaylistText'
							)}
							fetching={fetching}
						/>
						<NavbarModalButton
							ariaLabel={t(
								'collection.playlists.modal.addQueueAria'
							)}
							content={t(
								'collection.playlists.modal.addQueueText'
							)}
							fetching={fetching}
						/>
						<NavbarModalButton
							ariaLabel={t(
								'collection.playlists.modal.toRadioAria'
							)}
							content={t(
								'collection.playlists.modal.toRadioText'
							)}
							fetching={fetching}
						/>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(PlaylistModal);
