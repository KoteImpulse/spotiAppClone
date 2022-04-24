import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	MutableRefObject,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './LikedTracksSection.module.scss';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { IoTimeOutline } from 'react-icons/io5';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import SongCard from '../../../Cards/SongCard/SongCard';
import { Track } from '../../../../types/song';
import { useActions } from '../../../../hooks/useActions';
import { SpotiReq } from '../../../../lib/spotiReq';
import SongModal from '../../../Modals/SongModal/SongModal';
import {
	modalCloseData,
	modalClosePosition,
	modalPosition,
} from '../../../../lib/helper';

interface LikedTracksSectionProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const LikedTracksSection: FC<LikedTracksSectionProps> = ({
	className,
	...props
}) => {
	const { t } = useTranslation('mainview');
	const { data: session } = useSession();
	const { asPath } = useRouter();
	const [fetching, setFetching] = useState<boolean>(false);
	const refModal = useRef<HTMLDivElement>(null);
	const refSongItem = useRef<Array<HTMLDivElement | null>>([]);
	const { likedTracks } = useTypedSelector((state) => state.server);
	const { shouldLoading, songModalState, songData } = useTypedSelector(
		(state) => state.client
	);
	const {
		setSongModalState,
		setLikedTracks,
		setLoadingContent,
		setSongData,
	} = useActions();

	useEffect(() => {
		(async () => {
			try {
				if (shouldLoading === true) {
					const tracks = await SpotiReq()
						.getLikedTracks(
							50,
							likedTracks.songsArray.length,
							session?.user.accessToken
						)
						.then((res) => {
							return res ? res.json() : null;
						});
					const ids =
						tracks?.items
							?.map((item: Track) => item.track.id)
							.join(',') || '';
					const likedSongs = await SpotiReq()
						.checkSavedTracks(ids, session?.user.accessToken)
						.then((res) => (res ? res.json() : []));
					setLikedTracks({
						songsArray: [
							...likedTracks.songsArray,
							...tracks.items,
						],
						total: tracks.total,
						liked: [...likedTracks.liked, ...likedSongs],
					});
				}
			} catch (e: any) {
				console.log(e?.response?.data?.message);
			} finally {
				setLoadingContent(false);
			}
		})();
	}, [shouldLoading]);

	useEffect(() => {
		if (!refModal || !refSongItem) return;
		async function contextMenuClick(event: any) {
			try {
				event.preventDefault();
				if (songModalState.isOpened) {
					if (
						refModal.current &&
						!refModal.current.contains(event.target)
					) {
						setSongModalState({ ...modalClosePosition });
						setSongData({ ...modalCloseData });
					}
				}
				if (
					refSongItem.current &&
					refSongItem.current.includes(event.target)
				) {
					const songId = refSongItem?.current?.find(
						(item: any) => item === event.target
					)?.id;
					const coords = modalPosition(event, refModal, songId);
					setSongModalState({ ...coords });
					const song = likedTracks.songsArray.find(
						(s: Track) => s.track.id === songId
					);
					setSongData({
						songId: songId || '',
						songURI: song.track.uri,
					});
				}
			} catch (e) {
				console.log(e);
			}
		}

		function handleClick(event: any) {
			if (songModalState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setSongModalState({ ...modalClosePosition });
				}
			}
		}

		function handleScroll(event: any) {
			if (songModalState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setSongModalState({ ...modalClosePosition });
				}
			}
		}

		window.addEventListener('contextmenu', contextMenuClick);
		window.addEventListener('click', handleClick);
		window.addEventListener('wheel', handleScroll);

		return () => {
			window.removeEventListener('contextmenu', contextMenuClick);
			window.removeEventListener('click', handleClick);
			window.removeEventListener('wheel', handleScroll);
		};
	}, [
		likedTracks,
		refModal,
		refSongItem,
		setSongData,
		setSongModalState,
		songModalState,
		songModalState.inLibrary,
		songModalState.songId,
	]);

	const likedSongsNewArray = useMemo(() => {
		return [...likedTracks.songsArray.map((item: Track) => true)];
	}, [likedTracks]);

	const likeSong = async (songId: string) => {
		setFetching(true);
		const index = likedTracks.songsArray.indexOf(
			likedTracks.songsArray.find((s: Track) => s.track.id === songId)
		);
		try {
			await SpotiReq().removeFromLiked(songId, session?.user.accessToken);
			likedSongsNewArray[index] = false;
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			const index = likedTracks.songsArray.indexOf(
				likedTracks.songsArray.find(
					(item: Track) => item.track.id === songId
				)
			);
			setLikedTracks({
				songsArray: likedTracks.songsArray.filter(
					(item: Track) => item.track.id !== songId
				),
				total: likedTracks.total - 1,
				liked: likedTracks.liked.filter(
					(item: boolean, i: number) => i !== index
				),
			});
		}
	};

	return (
		<div className={cn(className, styles.likedTracksSection)} {...props}>
			<div className={styles.headerContainer}>
				{likedTracks.songsArray.length > 0 && (
					<div className={styles.header}>
						<div className={styles.index}>
							{t('playlistPage.songsHeader.index')}
						</div>
						<div className={styles.title}>
							{t('playlistPage.songsHeader.title')}
						</div>
						<div className={styles.album}>
							{t('playlistPage.songsHeader.album')}
						</div>
						<div className={styles.dateAdded}>
							{t('playlistPage.songsHeader.dateAdded')}
						</div>
						<div className={styles.duration}>
							<IoTimeOutline />
						</div>
					</div>
				)}
			</div>
			<div className={styles.songsContainer}>
				<div
					className={styles.songs}
					style={{
						height: `${
							likedTracks.songsArray.length > 0
								? likedTracks.songsArray.length * 56
								: 300
						}px`,
					}}
				>
					{likedTracks &&
						likedTracks.songsArray.map((item: Track, i: number) => {
							return (
								<SongCard
									usage='playlist'
									key={item.track.id}
									className={styles.song}
									song={item.track}
									artists={item.track.artists}
									duration={item.track.duration_ms}
									album={item.track.album}
									added_at={item.added_at}
									index={i}
									fetching={fetching}
									isLiked={true}
									likeSong={likeSong}
									isSelected={
										songData.songId === item.track.id
									}
									ref={(el: HTMLDivElement) =>
										(
											refSongItem as MutableRefObject<
												Array<HTMLDivElement | null>
											>
										).current.push(el)
									}
								/>
							);
						})}
				</div>
			</div>
			<SongModal
				ref={refModal}
				usage='liked'
				style={{
					visibility: songModalState.isOpened ? 'visible' : 'hidden',
					opacity: songModalState.isOpened ? 1 : 0,
					left: songModalState.isOpened ? `${songModalState.x}px` : 0,
					top: songModalState.isOpened ? `${songModalState.y}px` : 0,
				}}
				fetching={fetching}
				setFetching={setFetching}
			/>
		</div>
	);
};

export default LikedTracksSection;
