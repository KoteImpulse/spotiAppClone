import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './SelectedPlaylist.module.scss';
import Image from 'next/image';
import SongsSection from '../Sections/SongsSection/SongsSection';
import { useTranslation } from 'next-i18next';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { durationPlaylist, modalStaticPos } from '../../../lib/helper';
import PlaylistPlayButton from '../../Buttons/PlaylistPlayButton/PlaylistPlayButton';
import LikeButton from '../../Buttons/LikeButton/LikeButton';
import { Playlist } from '../../../types/playlist';
import { SpotiReq } from '../../../lib/spotiReq';
import { useSession } from 'next-auth/react';
import { useActions } from '../../../hooks/useActions';
import SelectedPlaylistModal from '../../Modals/SelectedPlaylistModal/SelectedPlaylistModal';
import OtherVariantsButton from '../../Buttons/OtherVariantsButton/OtherVariantsButton';
import { useRouter } from 'next/router';
import { Song } from '../../../types/song';

interface SelectedPlaylistProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	playlistIsLiked: boolean;
}

const SelectedPlaylist: FC<SelectedPlaylistProps> = ({
	className,
	playlistIsLiked,
	...props
}) => {
	const { t } = useTranslation('mainview');
	const { selectedPlaylist, userPlaylists, currentUser, songs } =
		useTypedSelector((state) => state.server);
	const { setPlaylist, setEditModalState } = useActions();
	const { data: session } = useSession();

	const [fetching, setFetching] = useState<boolean>(false);
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [isLiked, setIsLiked] = useState<boolean>(playlistIsLiked);
	const [xPos, setXPos] = useState<number>(0);
	const [yPos, setYPos] = useState<number>(0);

	const refModal = useRef<HTMLDivElement>(null);
	const refOpenButton = useRef<HTMLButtonElement>(null);

	const router = useRouter();

	const isMyOwn = userPlaylists.playlistsArray
		.filter((item: Playlist) => item.owner.id === currentUser.id)
		.map((item: Playlist) => {
			return item.id;
		})
		.includes(selectedPlaylist.id);

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
		}

		window.addEventListener('click', menuClick);
		window.addEventListener('wheel', menuScroll);

		return () => {
			window.removeEventListener('click', menuClick);
			window.removeEventListener('wheel', menuScroll);
		};
	}, [refModal, refOpenButton, isOpened]);

	useEffect(() => {}, [songs.songsArray, userPlaylists, isLiked]);

	const likePlaylist = async (playlistId: string) => {
		setFetching(true);
		setIsOpened(false);
		if (isLiked) {
			try {
				await SpotiReq().removePlaylistFromLibrary(
					playlistId,
					session?.user.accessToken
				);
				if (isMyOwn) {
					router.push('/collection/playlists');
				}
			} catch (e) {
				console.log(e);
			} finally {
				setIsLiked(false);
				setFetching(false);
				setPlaylist({
					playlistsArray: userPlaylists.playlistsArray.filter(
						(item: Playlist) => item.id !== playlistId
					),
					total: userPlaylists.total - 1,
				});
			}
		} else {
			try {
				await SpotiReq().addPlaylistToLibrary(
					playlistId,
					session?.user.accessToken
				);
				const playlists = await SpotiReq()
					.getUserPlaylists(50, 0, session?.user.accessToken)
					.then((res) => {
						return res ? res.json() : null;
					});
				if (playlists.items.length >= 0) {
					setPlaylist({
						playlistsArray: playlists.items,
						total: playlists.total,
					});
				}
			} catch (e) {
				console.log(e);
			} finally {
				setFetching(false);
				setIsLiked(true);
			}
		}
	};

	const editPlaylist = async (id: string) => {
		setFetching(true);
		try {
			setEditModalState({
				isOpened: true,
				id: selectedPlaylist.id,
				name: selectedPlaylist.name,
				description: selectedPlaylist.description,
				image: selectedPlaylist?.images[0]?.url || '',
			});
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setIsOpened(false);
		}
	};

	return (
		<section className={cn(className, styles.selectedPlaylist)} {...props}>
			<div className={styles.titleHalf}>
				<div className={styles.pictureBlock}>
					<div className={styles.imageContainer}>
						{selectedPlaylist.images.length === 0 ? (
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
								src={`https://res.cloudinary.com/demo/image/fetch/${selectedPlaylist.images[0].url}`}
								className={styles.nextImage}
								alt={selectedPlaylist.name}
								width={300}
								height={300}
								quality={60}
							/>
						)}
					</div>
				</div>
				<div className={styles.textBlock}>
					<h2 className={styles.type}>{selectedPlaylist.type}</h2>
					<span className={styles.name}>
						<h1 className={styles.headerText}>
							{selectedPlaylist.name}
						</h1>
					</span>
					<h2 className={styles.description}>
						<p
							className={styles.descriptionText}
							dangerouslySetInnerHTML={{
								__html: selectedPlaylist.description,
							}}
						/>
					</h2>
					<div className={styles.statsBlock}>
						<span className={styles.owner}>
							<span className={styles.ownerText}>
								{selectedPlaylist.owner.display_name}
							</span>
						</span>
						<span className={styles.likes}>
							{selectedPlaylist.followers.total > 0 &&
								`${selectedPlaylist.followers.total} ${t(
									'playlistPage.likes'
								)}`}
						</span>
						{selectedPlaylist.tracks.total > 0 && (
							<>
								<span className={styles.likes}>
									{`${songs.total} ${t(
										'playlistPage.tracks'
									)}`}
								</span>
								<span className={styles.duratiion}>
									{`${t(
										'playlistPage.duration'
									)} ${durationPlaylist(songs.songsArray)}`}
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
							ariaLabel={t('playlistPage.buttons.playAria')}
							size={54}
							fetching={fetching}
						/>
					)}

					{!isMyOwn &&
						selectedPlaylist.owner.id !== currentUser.id && (
							<LikeButton
								ariaLabel={t('playlistPage.buttons.likeAria')}
								usage={'playlist'}
								id={selectedPlaylist.id}
								size={30}
								isLiked={isLiked}
								fetching={fetching}
								like={likePlaylist}
							/>
						)}
					<OtherVariantsButton
						ariaLabel={t('playlistPage.buttons.options')}
						fetching={fetching}
						usage='playlist'
						onClick={() => setIsOpened(!isOpened)}
						isOpened={isOpened}
						ref={refOpenButton}
					/>
				</div>
				<div className={styles.songsContainer}>
					<SongsSection />
				</div>
			</div>
			<SelectedPlaylistModal
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
				deletePlaylist={likePlaylist}
				addPlaylistToLibrary={likePlaylist}
				editPlaylist={editPlaylist}
				addQueue={likePlaylist}
			/>
		</section>
	);
};

export default SelectedPlaylist;
