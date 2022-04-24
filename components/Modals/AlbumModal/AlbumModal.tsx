import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
} from 'react';
import cn from 'classnames';
import styles from './AlbumModal.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarModalButton from '../../Buttons/NavbarModalButton/NavbarModalButton';
import NavbarModalButtonList from '../../Buttons/NavbarModalButtonList/NavbarModalButtonList';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { modalClose, shareHandler } from '../../../lib/helper';
import { useActions } from '../../../hooks/useActions';
import { useRouter } from 'next/router';
import { SpotiReq } from '../../../lib/spotiReq';
import { useSession } from 'next-auth/react';
import { Artist } from '../../../types/artist';

interface AlbumModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	fetching: boolean;
	inLibrary: boolean;
	removeFromLibrary: (a: string) => void;
	addToLibrary: (a: string) => void;
	addToPlaylist: (a: string) => void;
	addQueue: (a: string) => void;
	setFetching: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlbumModal = (
	{
		fetching,
		setFetching,
		inLibrary,
		className,
		addToPlaylist,
		removeFromLibrary,
		addToLibrary,
		addQueue,
		...props
	}: AlbumModalProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');
	const { collectionAlbumState } = useTypedSelector((state) => state.client);
	const { setCollectionAlbumModalState } = useActions();
	const router = useRouter();
	const { data: session } = useSession();

	const toRecommendation = async () => {
		setFetching(true);
		try {
			const selectedAlbum = await SpotiReq()
				.getAlbum(collectionAlbumState.id, session?.user.accessToken)
				.then((res) => {
					return res ? res.json() : null;
				});
			const a = selectedAlbum.artists
				.map((item: Artist) => item.id)
				.slice(0, 4)
				.join(',');

			router.push({
				pathname: '/recommendation/',
				query: { artist: a },
			});
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setCollectionAlbumModalState({ ...modalClose });
		}
	};

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
							onClick={() => addQueue(collectionAlbumState.id)}

						/>
						<NavbarModalButton
							ariaLabel={t('collection.albums.modal.toRadioAria')}
							content={t('collection.albums.modal.toRadioText')}
							fetching={fetching}
							onClick={() => toRecommendation()}
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
									removeFromLibrary(collectionAlbumState.id)
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
									addToLibrary(collectionAlbumState.id)
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
							onClick={() => {
								shareHandler(
									'selectedAlbum',
									collectionAlbumState.id
								);
								setCollectionAlbumModalState({
									...modalClose,
								});
							}}
						/>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(AlbumModal);
