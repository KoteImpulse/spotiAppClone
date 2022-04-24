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
import Link from 'next/link';
import {
	modalClose,
	modalCollectionPos,
	songsFromPlaylist,
} from '../../../../lib/helper';
import { Song } from '../../../../types/song';

interface AlbumsSectionProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	albumsArray: IAlbum[];
	usage: 'selectedArtist' | 'collectionAlbums' | 'selectedAlbum' | 'mainPage';
	headerText?: string;
	total?: number;
}

const AlbumsSection: FC<AlbumsSectionProps> = ({
	albumsArray,
	total,
	headerText,
	usage,
	className,
	...props
}) => {
	const { collectionAlbumState, shouldLoading } = useTypedSelector(
		(state) => state.client
	);
	const { selectedAlbum, followingAlbums } = useTypedSelector(
		(state) => state.server
	);
	const { setCollectionAlbumModalState, setAlbums, setLoadingContent } =
		useActions();
	const { t } = useTranslation('mainview');
	const { asPath } = useRouter();

	const { data: session } = useSession();
	const [fetching, setFetching] = useState<boolean>(false);

	const refModal = useRef<HTMLDivElement>(null);
	const refAlbumItem = useRef<Array<HTMLDivElement | null>>([]);

	useEffect(() => {
		(async () => {
			try {
				if (shouldLoading === true) {
					const albums = await SpotiReq()
						.getAlbums(
							50,
							albumsArray.length,
							session?.user.accessToken
						)
						.then((res) => {
							return res ? res.json() : null;
						});
					setAlbums({
						albumsArray: [...albumsArray, ...albums.items],
						total: albums.total,
						liked: [],
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
		if (!refModal || !refAlbumItem) return;
		async function contextMenuClick(event: any) {
			try {
				event.preventDefault();
				if (collectionAlbumState.isOpened) {
					if (
						refModal.current &&
						!refModal.current.contains(event.target)
					) {
						setCollectionAlbumModalState({
							...modalClose,
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
					const coords = modalCollectionPos(event, refModal, albumId);
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
					setCollectionAlbumModalState({
						...coords,
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
						...modalClose,
					});
				}
			}
		}

		function handleScroll(event: any) {
			if (collectionAlbumState.isOpened) {
				if (
					usage !== 'selectedArtist' &&
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setCollectionAlbumModalState({
						...modalClose,
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
		setCollectionAlbumModalState,
		asPath,
		session?.user.accessToken,
		usage,
	]);

	const addToPlaylist = async (playlistId: string) => {
		setFetching(true);
		try {
			const songsFromPl = await songsFromPlaylist(
				playlistId,
				50,
				0,
				session?.user.accessToken
			);
			const albumTracks = await SpotiReq()
				.getAlbumTracks(
					collectionAlbumState.id,
					50,
					0,
					session?.user.accessToken
				)
				.then((res) => {
					return res ? res.json() : null;
				});
			const newOneTracks = albumTracks.items
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
			setCollectionAlbumModalState({
				...modalClose,
			});
		}
	};
	const removeFromLibrary = async (albumId: string) => {
		setFetching(true);
		try {
			await SpotiReq().removeAlbum(albumId, session?.user.accessToken);
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setAlbums({
				albumsArray: albumsArray.filter(
					(item: IAlbum) => item.album.id !== albumId
				),
				total: followingAlbums.total - 1,
				liked: [],
			});
			setCollectionAlbumModalState({
				...modalClose,
			});
		}
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
			...modalClose,
		});
	};
	const addQueue = async (plId: string) => {
		console.log(plId);
	};

	return (
		<>
			<section className={cn(className, styles.albumsSection)} {...props}>
				<div className={styles.headerContainer}>
					<h1 className={styles.textContent}>
						{usage === 'selectedAlbum' ? (
							<Link
								scroll
								href={`/artist/${selectedAlbum.artists[0].id}`}
							>
								<a
									className={styles.linkedText}
								>{`${headerText} ${selectedAlbum.artists[0].name}`}</a>
							</Link>
						) : (
							headerText
						)}
					</h1>
				</div>
				<div className={styles.scrollableContainer}>
					<div className={styles.gridContainer}>
						{albumsArray.length > 0 ? (
							albumsArray.map((item: any) => {
								return (
									<AlbumCard
										item={
											usage === 'collectionAlbums'
												? item.album
												: item
										}
										key={
											usage === 'collectionAlbums'
												? item.album.id
												: item.id
										}
										usage={usage}
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
					setFetching={setFetching}
					inLibrary={collectionAlbumState.inLibrary}
					removeFromLibrary={removeFromLibrary}
					addToLibrary={addToLibrary}
					addToPlaylist={addToPlaylist}
					addQueue={addQueue}
				/>
			</section>
		</>
	);
};

export default React.memo(AlbumsSection);
