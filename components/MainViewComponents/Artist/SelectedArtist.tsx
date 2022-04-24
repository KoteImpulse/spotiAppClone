import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './SelectedArtist.module.scss';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import PlaylistPlayButton from '../../Buttons/PlaylistPlayButton/PlaylistPlayButton';
import LikeButton from '../../Buttons/LikeButton/LikeButton';
import { SpotiReq } from '../../../lib/spotiReq';
import { useSession } from 'next-auth/react';
import OtherVariantsButton from '../../Buttons/OtherVariantsButton/OtherVariantsButton';
import { useRouter } from 'next/router';
import SelectedArtistModal from '../../Modals/SelectedArtistModal/SelectedArtistModal';
import ArtistSongsSection from '../Sections/ArtistSongsSection/ArtistSongsSection';
import AlbumsSection from '../Sections/AlbumsSection/AlbumsSection';
import { Album } from '../../../types/album';
import ArtistsSection from '../Sections/ArtistsSection/ArtistsSection';
import { Artist } from '../../../types/artist';
import { modalStaticPos } from '../../../lib/helper';

interface SelectedArtistProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	artistIsLiked: boolean;
}

const SelectedArtist: FC<SelectedArtistProps> = ({
	artistIsLiked,
	className,
	...props
}) => {
	const { t } = useTranslation('mainview');
	const { selectedArtist, songs, artistData } = useTypedSelector(
		(state) => state.server
	);
	const { data: session } = useSession();
	const [fetching, setFetching] = useState<boolean>(false);
	const [isLiked, setIsLiked] = useState<boolean>(artistIsLiked);
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [xPos, setXPos] = useState<number>(0);
	const [yPos, setYPos] = useState<number>(0);

	const refModal = useRef<HTMLDivElement>(null);
	const refOpenButton = useRef<HTMLButtonElement>(null);

	const router = useRouter();

	const artistAlbums = artistData.albums
		.filter(
			(item: Album) =>
				item.album_type === 'album' && item.album_group === 'album'
		)
		.filter((item: Album, i: number) => i < 8);
	const artistSingles = artistData.albums
		.filter(
			(item: Album) =>
				item.album_type === 'single' && item.album_group === 'single'
		)
		.filter((item: Album, i: number) => i < 8);
	const artistOther = artistData.albums
		.filter((item: Album) => item.album_group === 'appears_on')
		.filter((item: Album, i: number) => i < 8);
	const artistRelated = artistData.relatedArtists.filter(
		(item: Artist, i: number) => i < 8
	);

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

	const likeArtist = async (artistId: string) => {
		setFetching(true);
		setIsOpened(false);
		if (isLiked) {
			try {
				await SpotiReq().unFollowArtist(
					artistId,
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
				await SpotiReq().followArtist(
					artistId,
					session?.user.accessToken
				);
			} catch (e) {
				console.log(e);
			} finally {
				setFetching(false);
				setIsLiked(true);
			}
		}
	};
	return (
		<section className={cn(className, styles.selectedArtist)} {...props}>
			<div className={styles.titleHalf}>
				<div className={styles.pictureBlock}>
					<div className={styles.imageContainer}>
						{selectedArtist.images.length === 0 ? (
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
								src={`https://res.cloudinary.com/demo/image/fetch/${selectedArtist.images[0].url}`}
								className={styles.nextImage}
								alt={selectedArtist.name}
								width={300}
								height={300}
								quality={60}
								objectFit='cover'
							/>
						)}
					</div>
				</div>
				<div className={styles.textBlock}>
					<h2 className={styles.type}>{selectedArtist.album_type}</h2>
					<span className={styles.name}>
						<h1 className={styles.headerText}>
							{selectedArtist.name}
						</h1>
					</span>

					<div className={styles.statsBlock}>
						<span className={styles.owner}>
							<span className={styles.ownerText}>
								{`${selectedArtist.followers.total} ${t(
									'artistPage.followers'
								)}`}
							</span>
						</span>
					</div>
				</div>
			</div>
			<div className={styles.songsHalf}>
				<div className={styles.playlistButtons}>
					{artistData.songsArray.length > 0 && (
						<PlaylistPlayButton
							ariaLabel={t('artistPage.buttons.playAria')}
							size={54}
							fetching={fetching}
						/>
					)}
					<LikeButton
						ariaLabel={t('artistPage.buttons.likeAria')}
						usage={'artist'}
						id={selectedArtist.id}
						size={30}
						isLiked={isLiked}
						fetching={fetching}
						like={likeArtist}
					/>
					<OtherVariantsButton
						ariaLabel={t('artistPage.buttons.options')}
						fetching={fetching}
						usage='artist'
						onClick={() => setIsOpened(!isOpened)}
						isOpened={isOpened}
						ref={refOpenButton}
					/>
				</div>
				<div className={styles.songsContainer}>
					<ArtistSongsSection />
				</div>
				{artistAlbums.length > 0 && (
					<AlbumsSection
						albumsArray={artistAlbums}
						usage={'selectedArtist'}
						headerText={t('artistPage.albumsHeader.album')}
					/>
				)}
				{artistSingles.length > 0 && (
					<AlbumsSection
						albumsArray={artistSingles}
						usage={'selectedArtist'}
						headerText={t('artistPage.albumsHeader.single')}
					/>
				)}
				{artistOther.length > 0 && (
					<AlbumsSection
						albumsArray={artistOther}
						usage={'selectedArtist'}
						headerText={t('artistPage.albumsHeader.more')}
					/>
				)}
				{artistRelated.length > 0 && (
					<ArtistsSection
						artistsArray={artistRelated}
						usage='selectedArtist'
						headerText={t('artistPage.albumsHeader.relatedArtists')}
					/>
				)}
			</div>
			<SelectedArtistModal
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
				deleteArtistFromLibrary={likeArtist}
				addArtistToLibrary={likeArtist}
			/>
		</section>
	);
};

export default SelectedArtist;
