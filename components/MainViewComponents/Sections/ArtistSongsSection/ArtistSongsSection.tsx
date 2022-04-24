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
import styles from './ArtistSongsSection.module.scss';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import SongCard from '../../../Cards/SongCard/SongCard';
import { Song } from '../../../../types/song';
import { useActions } from '../../../../hooks/useActions';
import { SpotiReq } from '../../../../lib/spotiReq';
import SongModal from '../../../Modals/SongModal/SongModal';
import {
	modalClose,
	modalCloseData,
	modalClosePosition,
	modalPosition,
} from '../../../../lib/helper';

interface ArtistSongsSectionProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const ArtistSongsSection: FC<ArtistSongsSectionProps> = ({
	className,
	...props
}) => {
	const { t } = useTranslation('mainview');
	const { data: session } = useSession();
	const { asPath } = useRouter();
	const [fetching, setFetching] = useState<boolean>(false);
	const refModal = useRef<HTMLDivElement>(null);
	const refSongItem = useRef<Array<HTMLDivElement | null>>([]);
	const { artistData } = useTypedSelector((state) => state.server);
	const { setSongModalState, setSongData, setCollectionAlbumModalState } =
		useActions();
	const { songModalState, songData, collectionAlbumState } = useTypedSelector(
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
					const song = artistData.songsArray.find(
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
		artistData.songsArray,
		refModal,
		refSongItem,
		setSongData,
		setSongModalState,
		songModalState,
	]);

	const likedSongsNewArray = useMemo(() => {
		return [...artistData.liked];
	}, [artistData.liked]);

	const likeSong = async (songId: string, isLIked?: boolean) => {
		setFetching(true);
		const index = artistData.songsArray.indexOf(
			artistData.songsArray.find((s: Song) => s.id === songId)
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
		<div className={cn(className, styles.artistSongsSection)} {...props}>
			<div className={styles.headerContainer}>
				<div className={styles.header}>
					<h2 className={styles.popular}>
						{t('artistPage.songsHeader.popular')}
					</h2>
				</div>
			</div>
			<div className={styles.songsContainer}>
				<div
					className={styles.songs}
					style={{
						height: `${
							artistData.songsArray.length > 0
								? artistData.songsArray.length * 56
								: 300
						}px`,
					}}
				>
					{artistData.songsArray &&
						artistData.songsArray.map((item: Song, i: number) => {
							return (
								<SongCard
									usage='artist'
									album={item.album}
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
				usage='artist'
				ref={refModal}
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

export default ArtistSongsSection;
