import React, {
	DetailedHTMLProps,
	Dispatch,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	SetStateAction,
} from 'react';
import cn from 'classnames';
import styles from './SongModal.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarModalButton from '../../Buttons/NavbarModalButton/NavbarModalButton';
import NavbarModalButtonList from '../../Buttons/NavbarModalButtonList/NavbarModalButtonList';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useRouter } from 'next/router';
import { SpotiReq } from '../../../lib/spotiReq';
import { useSession } from 'next-auth/react';
import { useActions } from '../../../hooks/useActions';
import { Song, Track } from '../../../types/song';
import {
	modalCloseData,
	modalClosePosition,
	songsFromPlaylist,
} from '../../../lib/helper';

interface SongModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	fetching: boolean;
	usage: 'album' | 'artist' | 'playlist' | 'liked';
	setFetching: Dispatch<SetStateAction<boolean>>;
}

const SongModal = (
	{ setFetching, fetching, usage, className, ...props }: SongModalProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');
	const { songModalState, songData } = useTypedSelector(
		(state) => state.client
	);
	const { selectedPlaylist, currentUser, songs } = useTypedSelector(
		(state) => state.server
	);
	const { setSongModalState, setSongData, setSongs } = useActions();
	const { data: session } = useSession();
	const router = useRouter();

	// const showCopied = async () => {
	// 	setCopiedModal(true);
	// 	await controls.start('rest');
	// 	setCopiedModal(false);
	// };

	// const shareHandler = (postId?: number) => {
	// 	navigator.clipboard.writeText(`${process.env.CLIENT_URL}//${postId}`);
	// 	showCopied();
	// };

	const handleClick = async (type: 'album' | 'artist') => {
		setFetching(true);
		try {
			const song = await SpotiReq()
				.getTrack(`${songModalState.songId}`, session?.user.accessToken)
				.then((res) => (res ? res.json() : null));
			if (type === 'album') {
				router.push(`/album/${song.album.id}`);
			} else {
				router.push(`/artist/${song.artists[0].id}`);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setSongModalState({ ...modalClosePosition });
		}
	};

	const addToPlaylist = async (a: string) => {
		setFetching(true);
		try {
			const songsFromPl = await songsFromPlaylist(
				a,
				50,
				0,
				session?.user.accessToken
			);
			const newOneTracks = !songsFromPl
				?.map((item) => item.track.uri)
				.includes(songData.songURI);
			if (!newOneTracks) {
				console.log('песня уже в плейлисте');
				return;
			}
			await SpotiReq().addToPlaylist(
				a,
				songData.songURI,
				session?.user.accessToken
			);
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setSongModalState({ ...modalClosePosition });
			setSongData({ ...modalCloseData });
		}
	};

	const removeFromPlaylist = async () => {
		setFetching(true);
		try {
			await SpotiReq().removeFromPlaylist(
				selectedPlaylist.id,
				songData.songURI,
				session?.user.accessToken
			);
		} catch (e) {
			console.log(e);
		} finally {
			const index = songs.songsArray.indexOf(
				songs.songsArray.find(
					(item: Track) => item.track.id === songData.songId
				)
			);
			setSongs({
				songsArray: songs.songsArray.filter(
					(item: Track) => item.track.id !== songData.songId
				),
				total: songs.total - 1,
				liked: songs.liked.filter(
					(item: boolean, i: number) => i !== index
				),
			});
			setFetching(false);
			setSongModalState({ ...modalClosePosition });
			setSongData({ ...modalCloseData });
		}
	};

	const addQueue = async () => {
		console.log(songData.songId);
	};

	const toRecommendation = () => {
		router.push({
			pathname: '/recommendation/',
			query: { song: songData.songId },
		});
		setSongModalState({ ...modalClosePosition });
	};

	return (
		<div className={cn(className, styles.songModal)} {...props} ref={ref}>
			<div className={styles.menu}>
				<div className={styles.content}>
					<ul className={styles.linksList}>
						<NavbarModalButton
							ariaLabel={t('playlistPage.songModal.addQueueAria')}
							content={t('playlistPage.songModal.addQueueText')}
							fetching={fetching}
							onClick={() => addQueue()}
						/>
						<NavbarModalButton
							ariaLabel={t('playlistPage.songModal.toRadioAria')}
							content={t('playlistPage.songModal.toRadioText')}
							fetching={fetching}
							onClick={() => toRecommendation()}
						/>
						{usage !== 'artist' && (
							<NavbarModalButton
								ariaLabel={t(
									'playlistPage.songModal.toArtistAria'
								)}
								content={t(
									'playlistPage.songModal.toArtistText'
								)}
								fetching={fetching}
								onClick={() => handleClick('artist')}
							/>
						)}
						{usage !== 'album' && (
							<NavbarModalButton
								ariaLabel={t(
									'playlistPage.songModal.toAlbumAria'
								)}
								content={t(
									'playlistPage.songModal.toAlbumText'
								)}
								fetching={fetching}
								onClick={() => handleClick('album')}
							/>
						)}
						{usage === 'playlist' &&
							selectedPlaylist.owner.id === currentUser.id && (
								<NavbarModalButton
									ariaLabel={t(
										'playlistPage.songModal.removeFromPlaylistAria'
									)}
									content={t(
										'playlistPage.songModal.removeFromPlaylistText'
									)}
									fetching={fetching}
									onClick={() => removeFromPlaylist()}
								/>
							)}
						<NavbarModalButtonList
							ariaLabel={t(
								'playlistPage.songModal.addToPlaylistAria'
							)}
							content={t(
								'playlistPage.songModal.addToPlaylistText'
							)}
							fetching={fetching}
							array
							addToPlaylist={addToPlaylist}
							parent={songModalState}
							usage='selectedPlaylist'
						/>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default React.memo(forwardRef(SongModal));
