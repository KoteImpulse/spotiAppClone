import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	MutableRefObject,
	useEffect,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './SongsSection.module.scss';
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

interface SongsSectionProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const SongsSection: FC<SongsSectionProps> = ({ className, ...props }) => {
	const { t } = useTranslation('mainview');
	const { data: session } = useSession();
	const { asPath } = useRouter();
	const [fetching, setFetching] = useState<boolean>(false);
	const refModal = useRef<HTMLDivElement>(null);
	const refSongItem = useRef<Array<HTMLDivElement | null>>([]);
	const { selectedPlaylist, songs } = useTypedSelector(
		(state) => state.server
	);
	const { setSongModalState } = useActions();
	const { songModalState } = useTypedSelector((state) => state.client);

	useEffect(() => {
		if (!refModal || !refSongItem) return;
		async function contextMenuClick(event: any) {
			try {
				let xPosition = 0;
				let yPosition = 0;
				event.preventDefault();
				if (songModalState.isOpened) {
					if (
						refModal.current &&
						!refModal.current.contains(event.target)
					) {
						setSongModalState({
							isOpened: false,
							songId: '',
							x: 0,
							y: 0,
							height: 0,
							width: 0,
							inLibrary: false,
						});
					}
				}
				if (
					refSongItem.current &&
					refSongItem.current.includes(event.target)
				) {
					const songId = refSongItem?.current?.find(
						(item: any) => item === event.target
					)?.id;
					const res =
						asPath !== '/tracks'
							? await SpotiReq()
									.checkSavedTracks(
										[songId!],
										session?.user.accessToken
									)
									.then((res) => {
										return res ? res.json() : null;
									})
							: [true];

					let mouseX = event.clientX || event.touches[0].clientX;
					let mouseY = event.clientY || event.touches[0].clientY;
					let menuHeight =
						refModal?.current?.getBoundingClientRect().height;
					let menuWidth =
						refModal?.current?.getBoundingClientRect().width;
					let width = window.innerWidth;
					let height = window.innerHeight;

					if (menuHeight && menuWidth) {
						if (height - mouseY - 90 >= menuHeight) {
							if (width - mouseX < menuWidth) {
								xPosition = mouseX - menuWidth;
							} else {
								xPosition = mouseX;
							}
							yPosition = mouseY;
						} else {
							if (width - mouseX < menuWidth) {
								xPosition = mouseX - menuWidth;
							} else {
								xPosition = mouseX;
							}
							yPosition = mouseY - menuHeight;
						}
					}

					setSongModalState({
						isOpened: true,
						songId: songId || '',
						x: xPosition,
						y: yPosition,
						height: menuHeight,
						width: menuWidth,
						inLibrary: res[0],
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
					setSongModalState({
						isOpened: false,
						songId: '',
						x: 0,
						y: 0,
						height: 0,
						width: 0,
						inLibrary: false,
					});
				}
			}
		}

		function handleScroll(event: any) {
			if (songModalState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setSongModalState({
						isOpened: false,
						songId: '',
						x: 0,
						y: 0,
						height: 0,
						width: 0,
						inLibrary: false,
					});
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
	}, [refModal, refSongItem, songModalState, songModalState.songId]);

	return (
		<div className={cn(className, styles.songsSection)} {...props}>
			<div className={styles.headerContainer}>
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
						songs.songsArray.map((item: Track, i: number) => {
							return (
								<SongCard
									key={item.track.id}
									className={styles.song}
									track={item}
									index={i}
									fetching={fetching}
									isLiked={songs.liked[i]}
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
				style={{
					visibility: songModalState.isOpened ? 'visible' : 'hidden',
					opacity: songModalState.isOpened ? 1 : 0,
					left: songModalState.isOpened ? `${songModalState.x}px` : 0,
					top: songModalState.isOpened ? `${songModalState.y}px` : 0,
				}}
				fetching={fetching}
				inLibrary={songModalState.inLibrary}
				removeFromLikes={(a: string) => console.log(a)}
				addToLikes={(a: string) => console.log(a)}
				addToPlaylist={(a: string, b: string) => console.log(b, a)}
				addQueue={(a: string) => console.log(a)}
				toRadio={(a: string) => console.log(a)}
			/>
		</div>
	);
};

export default SongsSection;
