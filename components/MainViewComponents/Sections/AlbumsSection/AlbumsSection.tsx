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
import styles from './AlbumsSection.module.scss';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useTranslation } from 'next-i18next';
import AlbumCard from '../../../Cards/AlbumCard/AlbumCard';
import AlbumModal from '../../../Modals/AlbumModal/AlbumModal';
import { useActions } from '../../../../hooks/useActions';
import { useSession } from 'next-auth/react';
import { SpotiReq } from '../../../../lib/spotiReq';
import { useRouter } from 'next/router';
import { IAlbum } from '../../../../types/album';

interface AlbumsSectionProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	albumsArray: IAlbum[];
}

const AlbumsSection: FC<AlbumsSectionProps> = ({
	albumsArray,
	className,
	...props
}) => {
	const { collectionAlbumState } = useTypedSelector((state) => state.client);
	const { setCollectionAlbumModalState, setAlbums } = useActions();
	const { t } = useTranslation('mainview');
	const { asPath } = useRouter();

	const { data: session } = useSession();
	const [fetching, setFetching] = useState<boolean>(false);

	const refModal = useRef<HTMLDivElement>(null);
	const refAlbumItem = useRef<Array<HTMLDivElement | null>>([]);

	useEffect(() => {
		if (!refModal || !refAlbumItem) return;
		async function contextMenuClick(event: any) {
			try {
				let xPosition = 0;
				let yPosition = 0;
				event.preventDefault();
				if (collectionAlbumState.isOpened) {
					if (
						refModal.current &&
						!refModal.current.contains(event.target)
					) {
						setCollectionAlbumModalState({
							isOpened: false,
							albumId: '',
							x: 0,
							y: 0,
							height: 0,
							width: 0,
							inLibrary: false,
						});
					}
				}
				if (
					refAlbumItem.current &&
					refAlbumItem.current.includes(event.target)
				) {
					const albumId = refAlbumItem?.current?.find(
						(item: any) => item === event.target
					)?.id;
					const res =
						asPath !== '/collection/albums'
							? await SpotiReq()
									.checkSavedAlbum(
										albumId!,
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

					setCollectionAlbumModalState({
						isOpened: true,
						albumId: albumId || '',
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
			if (collectionAlbumState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setCollectionAlbumModalState({
						isOpened: false,
						albumId: '',
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
			if (collectionAlbumState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setCollectionAlbumModalState({
						isOpened: false,
						albumId: '',
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
		refAlbumItem,
		collectionAlbumState,
		collectionAlbumState.albumId,
	]);

	const addToPlaylist = async (playlistId: string, albumId: string) => {
		console.log(playlistId, albumId);
	};
	const removeFromLibrary = async (albumId: string) => {
		setFetching(true);
		try {
			await SpotiReq().removeAlbum(albumId, session?.user.accessToken);
			const albums = await SpotiReq()
				.getAlbums(session?.user.accessToken)
				.then((res) => {
					return res ? res.json() : null;
				});
			if (albums?.items.length >= 0) {
				setAlbums(albums.items);
			}
		} catch (e) {
			setAlbums([]);
			console.log(e);
		} finally {
			setFetching(false);
		}

		setCollectionAlbumModalState({
			isOpened: false,
			albumId: '',
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			inLibrary: false,
		});
	};
	const addToLibrary = async (albumId: string) => {
		setFetching(true);
		try {
			await SpotiReq().saveAlbum(albumId, session?.user.accessToken);
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
		}

		setCollectionAlbumModalState({
			isOpened: false,
			albumId: '',
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			inLibrary: false,
		});
	};
	const addQueue = async (plId: string) => {
		console.log(plId);
		console.log(collectionAlbumState.albumId);
	};
	const toRadio = async (plId: string) => {
		console.log(plId);
		console.log(collectionAlbumState.albumId);
	};

	return (
		<>
			<section className={cn(className, styles.albumsSection)} {...props}>
				<div className={styles.headerContainer}>
					<h1 className={styles.textContent}>
						{t('collection.albums.header')}
					</h1>
				</div>
				<div className={styles.scrollableContainer}>
					<div className={styles.gridContainer}>
						{albumsArray.length > 0 ? (
							albumsArray.map((item: any) => {
								return (
									<AlbumCard
										item={item.album}
										key={item.album.id}
										ref={(el: HTMLDivElement) =>
											(
												refAlbumItem as MutableRefObject<
													Array<HTMLDivElement | null>
												>
											).current.push(el)
										}
									/>
								);
							})
						) : (
							<p>{t('errors.albumEmptyError')}</p>
						)}
					</div>
				</div>
				<AlbumModal
					ref={refModal}
					style={{
						visibility: collectionAlbumState.isOpened
							? 'visible'
							: 'hidden',
						opacity: collectionAlbumState.isOpened ? 1 : 0,
						left: collectionAlbumState.isOpened
							? `${collectionAlbumState.x}px`
							: 0,
						top: collectionAlbumState.isOpened
							? `${collectionAlbumState.y}px`
							: 0,
					}}
					fetching={fetching}
					inLibrary={collectionAlbumState.inLibrary}
					removeFromLibrary={removeFromLibrary}
					addToLibrary={addToLibrary}
					addToPlaylist={addToPlaylist}
					addQueue={addQueue}
					toRadio={toRadio}
				/>
			</section>
		</>
	);
};

export default React.memo(AlbumsSection);
