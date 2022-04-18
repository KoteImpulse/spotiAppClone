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
import styles from './ArtistsSection.module.scss';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useTranslation } from 'next-i18next';
import CollectionArtistCard from '../../../Cards/ArtistCard/ArtistCard';
import { useActions } from '../../../../hooks/useActions';
import { useSession } from 'next-auth/react';
import ArtistModal from '../../../Modals/CollectionArtistModal/ArtistModal';
import { SpotiReq } from '../../../../lib/spotiReq';
import { useRouter } from 'next/router';
import { Artist } from '../../../../types/artist';

interface ArtistsSectionProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	artistsArray: Artist[];
}

const ArtistsSection: FC<ArtistsSectionProps> = ({
	className,
	artistsArray,
	...props
}) => {
	const { t } = useTranslation('mainview');
	const { collectionArtistState } = useTypedSelector((state) => state.client);
	const { setCollectionArtistModalState, setArtists } = useActions();
	const { data: session } = useSession();
	const [fetching, setFetching] = useState<boolean>(false);
	const { asPath } = useRouter();

	const refModal = useRef<HTMLDivElement>(null);
	const refArtistItem = useRef<Array<HTMLDivElement | null>>([]);

	useEffect(() => {
		if (!refModal || !refArtistItem) return;
		async function contextMenuClick(event: any) {
			try {
				let xPosition = 0;
				let yPosition = 0;
				event.preventDefault();
				if (collectionArtistState.isOpened) {
					if (
						refModal.current &&
						!refModal.current.contains(event.target)
					) {
						setCollectionArtistModalState({
							isOpened: false,
							artistId: '',
							x: 0,
							y: 0,
							height: 0,
							width: 0,
							inLibrary: false,
						});
					}
				}
				if (
					refArtistItem.current &&
					refArtistItem.current.includes(event.target)
				) {
					const artistId = refArtistItem?.current?.find(
						(item: any) => item === event.target
					)?.id;

					const res =
						asPath !== '/collection/artists'
							? await SpotiReq()
									.checkSavedAlbum(
										artistId!,
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

					setCollectionArtistModalState({
						isOpened: true,
						artistId: artistId || '',
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
			if (collectionArtistState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setCollectionArtistModalState({
						isOpened: false,
						artistId: '',
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
			if (collectionArtistState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setCollectionArtistModalState({
						isOpened: false,
						artistId: '',
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
	}, [
		refModal,
		refArtistItem,
		collectionArtistState,
		collectionArtistState.artistId,
	]);

	const toRadio = async (a: string) => {
		console.log(a);
	};
	const followArtist = async (artistId: string) => {
		setFetching(true);
		try {
			await SpotiReq().followArtist(artistId, session?.user.accessToken);
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
		}
		setCollectionArtistModalState({
			isOpened: false,
			artistId: '',
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			inLibrary: false,
		});
	};
	const unFollowArtist = async (artistId: string) => {
		setFetching(true);
		try {
			await SpotiReq().unFollowArtist(
				artistId,
				session?.user.accessToken
			);
			const artists = await SpotiReq()
				.getUserFollowingArtist(session?.user.accessToken)
				.then((res) => {
					return res ? res.json() : null;
				});
			if (artists.artists.items.length >= 0) {
				setArtists(artists.artists.items);
			}
		} catch (e) {
			setArtists([]);
			console.log(e);
		} finally {
			setFetching(false);
		}
		setCollectionArtistModalState({
			isOpened: false,
			artistId: '',
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			inLibrary: false,
		});
	};

	return (
		<section className={cn(className, styles.artistsSection)} {...props}>
			<div className={styles.headerContainer}>
				<h1 className={styles.textContent}>
					{t('collection.artists.header')}
				</h1>
			</div>
			<div className={styles.scrollableContainer}>
				<div className={styles.gridContainer}>
					{artistsArray.length > 0 ? (
						artistsArray.map((item: any) => {
							return (
								<CollectionArtistCard
									item={item}
									key={item.id}
									ref={(el: HTMLDivElement) =>
										(
											refArtistItem as MutableRefObject<
												Array<HTMLDivElement | null>
											>
										).current.push(el)
									}
								/>
							);
						})
					) : (
						<p>{t('errors.artistEmptyError')}</p>
					)}
				</div>
			</div>
			<ArtistModal
				ref={refModal}
				style={{
					visibility: collectionArtistState.isOpened
						? 'visible'
						: 'hidden',
					opacity: collectionArtistState.isOpened ? 1 : 0,
					left: collectionArtistState.isOpened
						? `${collectionArtistState.x}px`
						: 0,
					top: collectionArtistState.isOpened
						? `${collectionArtistState.y}px`
						: 0,
				}}
				fetching={fetching}
				inLibrary={collectionArtistState.inLibrary}
				toRadio={toRadio}
				followArtist={followArtist}
				unFollowArtist={unFollowArtist}
			/>
		</section>
	);
};

export default React.memo(ArtistsSection);
