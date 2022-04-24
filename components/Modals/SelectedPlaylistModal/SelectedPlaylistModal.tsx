import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
} from 'react';
import cn from 'classnames';
import styles from './SelectedPlaylistModal.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarModalButton from '../../Buttons/NavbarModalButton/NavbarModalButton';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { shareHandler, songsFromPlaylist } from '../../../lib/helper';
import { Playlist } from '../../../types/playlist';
import { useRouter } from 'next/router';
import { useActions } from '../../../hooks/useActions';
import { useSession } from 'next-auth/react';

interface SelectedPlaylistModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	fetching: boolean;
	inLibrary: boolean;
	deletePlaylist: (a: string) => void;
	addPlaylistToLibrary: (a: string) => void;
	editPlaylist: (a: string) => void;
	addQueue: (a: string) => void;
	setFetching: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectedPlaylistModal = (
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
	}: SelectedPlaylistModalProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');
	const { selectedPlaylist, currentUser, userPlaylists } = useTypedSelector(
		(state) => state.server
	);
	const { data: session } = useSession();
	const { setSongModalState, setSongData, setSongs } = useActions();
	const router = useRouter();

	// const showCopied = async () => {
	// 	setCopiedModal(true);
	// 	await controls.start('rest');
	// 	setCopiedModal(false);
	// };

	const toRecommendation = async () => {
		setFetching(true);
		try {
			const songsFromPl = await songsFromPlaylist(
				selectedPlaylist.id,
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
		}
	};

	return (
		<div
			className={cn(className, styles.selectedPlaylistModal)}
			{...props}
			ref={ref}
		>
			<div className={styles.menu}>
				<div className={styles.content}>
					<ul className={styles.linksList}>
						{inLibrary ? (
							<NavbarModalButton
								ariaLabel={t(
									'playlistPage.playlistModal.deletePlaylistAria'
								)}
								content={t(
									'playlistPage.playlistModal.deletePlaylistText'
								)}
								onClick={() =>
									deletePlaylist(selectedPlaylist.id)
								}
								fetching={fetching}
							/>
						) : (
							<NavbarModalButton
								ariaLabel={t(
									'playlistPage.playlistModal.addPlaylistAria'
								)}
								content={t(
									'playlistPage.playlistModal.addPlaylistText'
								)}
								onClick={() =>
									addPlaylistToLibrary(selectedPlaylist.id)
								}
								fetching={fetching}
							/>
						)}
						{currentUser.id === selectedPlaylist.owner.id && (
							<NavbarModalButton
								ariaLabel={t(
									'playlistPage.playlistModal.editPlaylistAria'
								)}
								content={t(
									'playlistPage.playlistModal.editPlaylistText'
								)}
								fetching={fetching}
								onClick={() =>
									editPlaylist(selectedPlaylist.id)
								}
							/>
						)}
						<NavbarModalButton
							ariaLabel={t(
								'playlistPage.playlistModal.addQueueAria'
							)}
							content={t(
								'playlistPage.playlistModal.addQueueText'
							)}
							fetching={fetching}
						/>
						<NavbarModalButton
							ariaLabel={t(
								'playlistPage.playlistModal.toRadioAria'
							)}
							content={t(
								'playlistPage.playlistModal.toRadioText'
							)}
							fetching={fetching}
							onClick={() => toRecommendation()}
						/>
						<NavbarModalButton
							ariaLabel={t(
								'playlistPage.playlistModal.shareAria'
							)}
							content={t('playlistPage.playlistModal.shareText')}
							fetching={fetching}
							onClick={() =>
								shareHandler(
									'selectedPlaylist',
									selectedPlaylist.id
								)
							}
						/>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(SelectedPlaylistModal);
