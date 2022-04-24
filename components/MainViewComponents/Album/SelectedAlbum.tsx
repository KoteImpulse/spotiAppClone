import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './SelectedAlbum.module.scss';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import {
	durationAlbum,
	modalStaticPos,
	songsFromPlaylist,
} from '../../../lib/helper';
import PlaylistPlayButton from '../../Buttons/PlaylistPlayButton/PlaylistPlayButton';
import LikeButton from '../../Buttons/LikeButton/LikeButton';
import { SpotiReq } from '../../../lib/spotiReq';
import { useSession } from 'next-auth/react';
import OtherVariantsButton from '../../Buttons/OtherVariantsButton/OtherVariantsButton';
import Link from 'next/link';
import AlbumSongsSection from '../Sections/AlbumSongsSection/AlbumSongsSection';
import SelectedAlbumModal from '../../Modals/SelectedAlbumModal/SelectedAlbumModal';
import AlbumsSection from '../Sections/AlbumsSection/AlbumsSection';
import { Album } from '../../../types/album';
import { Song } from '../../../types/song';

interface SelectedAlbumProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	albumIsLiked: boolean;
}

const SelectedAlbum: FC<SelectedAlbumProps> = ({
	albumIsLiked,
	className,
	...props
}) => {
	const { t } = useTranslation('mainview');
	const { selectedAlbum, songs, artistData } = useTypedSelector(
		(state) => state.server
	);
	const { data: session } = useSession();
	const [fetching, setFetching] = useState<boolean>(false);
	const [isLiked, setIsLiked] = useState<boolean>(albumIsLiked);
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [xPos, setXPos] = useState<number>(0);
	const [yPos, setYPos] = useState<number>(0);

	const refModal = useRef<HTMLDivElement>(null);
	const refOpenButton = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!refModal || !refOpenButton) return;

		async function menuClick(event: any) {
			if (isOpened) {
				if (
					refOpenButton.current &&
					!refOpenButton.current.contains(event.target)
				) {
					setIsOpened(false);
				}
			}
			if (
				refOpenButton.current &&
				!refOpenButton.current.contains(event.target)
			) {
				return;
			}
			const [xPosition, yPosition] = modalStaticPos(event, refModal);
			setXPos(xPosition);
			setYPos(yPosition);
		}

		function menuScroll(event: any) {
			if (isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setIsOpened(false);
				}
			}
			if (
				refOpenButton.current &&
				!refOpenButton.current.contains(event.target)
			) {
				return;
			}
		}

		window.addEventListener('click', menuClick);
		window.addEventListener('wheel', menuScroll);

		return () => {
			window.removeEventListener('click', menuClick);
			window.removeEventListener('wheel', menuScroll);
		};
	}, [refModal, refOpenButton, isOpened]);

	const addToPlaylist = async (playlistId: string) => {
		setFetching(true);
		try {
			const songsFromPl = await songsFromPlaylist(
				playlistId,
				50,
				0,
				session?.user.accessToken
			);
			const newOneTracks = selectedAlbum.tracks.items
				.filter(
					(item: Song) =>
						!songsFromPl
							?.map((item) => item.track.uri)
							.includes(item.uri)
				)
				.map((item: Song) => item.uri)
				.join(',');

			if (newOneTracks) {
				await SpotiReq().addToPlaylist(
					playlistId,
					newOneTracks,
					session?.user.accessToken
				);
			} else {
				console.log('уже в плейлисте');
			}
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setIsOpened(false);
		}
	};

	const likeAlbum = async (albumId: string) => {
		setFetching(true);
		setIsOpened(false);
		if (isLiked) {
			try {
				await SpotiReq().removeAlbum(
					albumId,
					session?.user.accessToken
				);
			} catch (e) {
				console.log(e);
			} finally {
				setIsLiked(false);
				setFetching(false);
			}
		} else {
			try {
				await SpotiReq().saveAlbum(albumId, session?.user.accessToken);
			} catch (e) {
				console.log(e);
			} finally {
				setFetching(false);
				setIsLiked(true);
			}
		}
	};

	return (
		<section className={cn(className, styles.selectedAlbum)} {...props}>
			<div className={styles.titleHalf}>
				<div className={styles.pictureBlock}>
					<div className={styles.imageContainer}>
						{selectedAlbum.images.length === 0 ? (
							<Image
								src={'/noImg.png'}
								className={styles.nextImage}
								alt={'no image'}
								width={300}
								height={300}
								quality={60}
							/>
						) : (
							<Image
								src={`https://res.cloudinary.com/demo/image/fetch/${selectedAlbum.images[0].url}`}
								className={styles.nextImage}
								alt={selectedAlbum.name}
								width={300}
								height={300}
								quality={60}
							/>
						)}
					</div>
				</div>
				<div className={styles.textBlock}>
					<h2 className={styles.type}>{selectedAlbum.album_type}</h2>
					<span className={styles.name}>
						<h1 className={styles.headerText}>
							{selectedAlbum.name}
						</h1>
					</span>

					<div className={styles.statsBlock}>
						<span className={styles.owner}>
							{selectedAlbum.artists.map((artist: any) => (
								<Link
									key={artist.id}
									href={`/artist/${artist.id}`}
									scroll
								>
									<a className={styles.ownerText}>
										{`${artist.name}${'\u00A0'}`}
									</a>
								</Link>
							))}
						</span>
						<span className={styles.year}>
							{new Date(selectedAlbum.release_date).getFullYear()}
						</span>
						{selectedAlbum.tracks.total > 0 && (
							<>
								<span className={styles.total}>
									{`${selectedAlbum.tracks.total} ${t(
										'albumPage.tracks'
									)}`}
								</span>
								<span className={styles.duratiion}>
									{`${t(
										'albumPage.duration'
									)} ${durationAlbum(songs.songsArray)}`}
								</span>
							</>
						)}
					</div>
				</div>
			</div>
			<div className={styles.songsHalf}>
				<div className={styles.playlistButtons}>
					{songs.songsArray.length > 0 && (
						<PlaylistPlayButton
							ariaLabel={t('albumPage.buttons.playAria')}
							size={54}
							fetching={fetching}
						/>
					)}
					<LikeButton
						ariaLabel={t('albumPage.buttons.likeAria')}
						usage='album'
						id={selectedAlbum.id}
						size={30}
						isLiked={isLiked}
						fetching={fetching}
						like={likeAlbum}
					/>
					<OtherVariantsButton
						ariaLabel={t('albumPage.buttons.options')}
						fetching={fetching}
						usage='album'
						onClick={() => setIsOpened(!isOpened)}
						isOpened={isOpened}
						ref={refOpenButton}
					/>
				</div>
				<div className={styles.songsContainer}>
					<AlbumSongsSection />
				</div>
				{artistData.albums.length > 0 && (
					<AlbumsSection
						albumsArray={artistData.albums.filter(
							(item: Album) => item.id !== selectedAlbum.id
						)}
						headerText={t('albumPage.otherAlbums')}
						usage={'selectedAlbum'}
					/>
				)}
			</div>
			<SelectedAlbumModal
				ref={refModal}
				style={{
					visibility: isOpened ? 'visible' : 'hidden',
					opacity: isOpened ? 1 : 0,
					left: isOpened ? `${xPos}px` : 0,
					top: isOpened ? `${yPos}px` : 0,
				}}
				fetching={fetching}
				setFetching={setFetching}
				inLibrary={isLiked}
				deleteAlbumFromLibrary={likeAlbum}
				addAlbumToLibrary={likeAlbum}
				addToPlaylist={(id: string) => addToPlaylist(id)}
				addQueue={() => console.log('a')}
			/>
		</section>
	);
};

export default SelectedAlbum;
