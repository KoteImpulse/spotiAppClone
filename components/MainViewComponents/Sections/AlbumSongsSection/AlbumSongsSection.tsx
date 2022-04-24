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
import styles from './AlbumSongsSection.module.scss';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { IoTimeOutline } from 'react-icons/io5';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import SongCard from '../../../Cards/SongCard/SongCard';
import { Song } from '../../../../types/song';
import { useActions } from '../../../../hooks/useActions';
import { SpotiReq } from '../../../../lib/spotiReq';
import SongModal from '../../../Modals/SongModal/SongModal';
import {
	modalCloseData,
	modalClosePosition,
	modalPosition,
} from '../../../../lib/helper';

interface AlbumSongsSectionProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const AlbumSongsSection: FC<AlbumSongsSectionProps> = ({
	className,
	...props
}) => {
	const { t } = useTranslation('mainview');
	const { data: session } = useSession();
	const { asPath } = useRouter();
	const [fetching, setFetching] = useState<boolean>(false);
	const refModal = useRef<HTMLDivElement>(null);
	const refSongItem = useRef<Array<HTMLDivElement | null>>([]);
	const { selectedAlbum, songs } = useTypedSelector((state) => state.server);
	const { setSongModalState, setSongData } = useActions();
	const { songModalState, songData } = useTypedSelector(
		(state) => state.client
	);

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
					const song = songs.songsArray.find(
						(s: Song) => s.id === songId
					);
					setSongData({
						songId: songId || '',
						songURI: song.uri,
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
		refModal,
		refSongItem,
		setSongData,
		setSongModalState,
		songModalState,
		songModalState.songId,
		songs.songsArray,
	]);

	const likedSongsNewArray = useMemo(() => {
		return [...songs.liked];
	}, [songs.liked]);

	const likeSong = async (songId: string, isLIked?: boolean) => {
		setFetching(true);
		const index = songs.songsArray.indexOf(
			songs.songsArray.find((s: Song) => s.id === songId)
		);
		if (isLIked) {
			try {
				await SpotiReq().removeFromLiked(
					songId,
					session?.user.accessToken
				);
				likedSongsNewArray[index] = false;
			} catch (e) {
				console.log(e);
			} finally {
				setFetching(false);
			}
		} else {
			try {
				await SpotiReq().addToLiked(songId, session?.user.accessToken);
				likedSongsNewArray[index] = true;
			} catch (e) {
				console.log(e);
			} finally {
				setFetching(false);
			}
		}
	};

	return (
		<div className={cn(className, styles.albumSongsSection)} {...props}>
			<div className={styles.headerContainer}>
				<div className={styles.header}>
					<div className={styles.index}>
						{t('albumPage.songsHeader.index')}
					</div>
					<div className={styles.title}>
						{t('albumPage.songsHeader.title')}
					</div>
					<div className={styles.album}>
						{t('albumPage.songsHeader.album')}
					</div>
					<div className={styles.dateAdded}>
						{t('albumPage.songsHeader.dateAdded')}
					</div>
					<div className={styles.duration}>
						<IoTimeOutline />
					</div>
				</div>
			</div>
			<div className={styles.songsContainer}>
				<div
					className={styles.songs}
					style={{
						height: `${
							songs.songsArray.length > 0
								? songs.songsArray.length * 56
								: 300
						}px`,
					}}
				>
					{songs.songsArray &&
						songs.songsArray.map((item: Song, i: number) => {
							return (
								<SongCard
									usage='album'
									key={item.id}
									className={styles.song}
									song={item}
									artists={item.artists}
									duration={item.duration_ms}
									index={i}
									fetching={fetching}
									isLiked={likedSongsNewArray[i]}
									likeSong={likeSong}
									isSelected={songData.songId === item.id}
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
				usage='album'
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

export default AlbumSongsSection;
