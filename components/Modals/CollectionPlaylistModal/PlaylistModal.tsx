import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './PlaylistModal.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarModalButton from '../../Buttons/NavbarModalButton/NavbarModalButton';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import {
	modalClose,
	shareHandler,
	songsFromPlaylist,
} from '../../../lib/helper';
import { useActions } from '../../../hooks/useActions';
import { Playlist } from '../../../types/playlist';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface PlaylistModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	fetching: boolean;
	inLibrary: boolean;
	deletePlaylist: (a: string) => void;
	addPlaylistToLibrary: (a: string) => void;
	editPlaylist: (a: string) => void;
	addQueue: (a: string) => void;
	setFetching: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlaylistModal = (
	{
		fetching,
		setFetching,
		inLibrary,
		addPlaylistToLibrary,
		deletePlaylist,
		className,
		editPlaylist,
		addQueue,
		...props
	}: PlaylistModalProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');
	const { collectionPlaylistState } = useTypedSelector(
		(state) => state.client
	);
	const { currentUser, userPlaylists } = useTypedSelector(
		(state) => state.server
	);
	const { setCollectionPlaylistModalState } = useActions();
	const { data: session } = useSession();
	const router = useRouter();

	const toRecommendation = async () => {
		setFetching(true);
		try {
			const songsFromPl = await songsFromPlaylist(
				collectionPlaylistState.id,
				50,
				0,
				session?.user.accessToken
			);
			const a = [
				...new Set(
					songsFromPl?.map((item) => item.track.artists[0].id)
				),
			]
				.slice(0, 4)
				.join(',');

			router.push({
				pathname: '/recommendation/',
				query: { playlist: a },
			});
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setCollectionPlaylistModalState({ ...modalClose });
		}
	};

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
									deletePlaylist(collectionPlaylistState.id)
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
										collectionPlaylistState.id
									)
								}
								fetching={fetching}
							/>
						)}
						{currentUser.id ===
							userPlaylists.playlistsArray.find(
								(item: Playlist) =>
									item.id === collectionPlaylistState.id
							)?.owner.id && (
							<NavbarModalButton
								ariaLabel={t(
									'collection.playlists.modal.editPlaylistAria'
								)}
								content={t(
									'collection.playlists.modal.editPlaylistText'
								)}
								fetching={fetching}
								onClick={() => editPlaylist(collectionPlaylistState.id)}
							/>
						)}
						<NavbarModalButton
							ariaLabel={t(
								'collection.playlists.modal.addQueueAria'
							)}
							content={t(
								'collection.playlists.modal.addQueueText'
							)}
							fetching={fetching}
							onClick={() => addQueue(collectionPlaylistState.id)}

						/>
						<NavbarModalButton
							ariaLabel={t(
								'collection.playlists.modal.toRadioAria'
							)}
							content={t(
								'collection.playlists.modal.toRadioText'
							)}
							fetching={fetching}
							onClick={() => toRecommendation()}
						/>
						<NavbarModalButton
							ariaLabel={t(
								'collection.playlists.modal.shareAria'
							)}
							content={t('collection.playlists.modal.shareText')}
							fetching={fetching}
							onClick={() => {
								shareHandler(
									'selectedPlaylist',
									collectionPlaylistState.id
								);
								setCollectionPlaylistModalState({
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

export default forwardRef(PlaylistModal);
