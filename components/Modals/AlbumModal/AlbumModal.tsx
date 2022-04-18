import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	useEffect,
} from 'react';
import cn from 'classnames';
import styles from './AlbumModal.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarModalButton from '../../Buttons/NavbarModalButton/NavbarModalButton';
import NavbarModalButtonList from '../../Buttons/NavbarModalButtonList/NavbarModalButtonList';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

interface AlbumModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	fetching: boolean;
	inLibrary: boolean;
	removeFromLibrary: (a: string) => void;
	addToLibrary: (a: string) => void;
	addToPlaylist: (a: string, b: string) => void;
	addQueue: (a: string) => void;
	toRadio: (a: string) => void;
}

const AlbumModal = (
	{
		fetching,
		inLibrary,
		className,
		addToPlaylist,
		removeFromLibrary,
		addToLibrary,
		addQueue,
		toRadio,
		...props
	}: AlbumModalProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');
	const { collectionAlbumState } = useTypedSelector((state) => state.client);

	return (
		<div className={cn(className, styles.albumModal)} {...props} ref={ref}>
			<div className={styles.menu}>
				<div className={styles.content}>
					<ul className={styles.linksList}>
						<NavbarModalButton
							ariaLabel={t(
								'collection.albums.modal.addQueueAria'
							)}
							content={t('collection.albums.modal.addQueueText')}
							fetching={fetching}
						/>
						<NavbarModalButton
							ariaLabel={t('collection.albums.modal.toRadioAria')}
							content={t('collection.albums.modal.toRadioText')}
							fetching={fetching}
						/>
						{inLibrary ? (
							<NavbarModalButton
								ariaLabel={t(
									'collection.albums.modal.removeFromLibraryAria'
								)}
								content={t(
									'collection.albums.modal.removeFromLibraryText'
								)}
								fetching={fetching}
								onClick={() =>
									removeFromLibrary(
										collectionAlbumState.albumId
									)
								}
							/>
						) : (
							<NavbarModalButton
								ariaLabel={t(
									'collection.albums.modal.addToLibraryAria'
								)}
								content={t(
									'collection.albums.modal.addToLibraryText'
								)}
								fetching={fetching}
								onClick={() =>
									addToLibrary(collectionAlbumState.albumId)
								}
							/>
						)}
						<NavbarModalButtonList
							ariaLabel={t(
								'collection.albums.modal.addToPlaylistAria'
							)}
							content={t(
								'collection.albums.modal.addToPlaylistText'
							)}
							fetching={fetching}
							array
							addToPlaylist={addToPlaylist}
							parent={collectionAlbumState}
							usage='collectionAlbum'
						/>
						<NavbarModalButton
							ariaLabel={t('collection.albums.modal.shareAria')}
							content={t('collection.albums.modal.shareText')}
							fetching={fetching}
						/>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(AlbumModal);
