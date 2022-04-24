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
import styles from './PlaylistsSection.module.scss';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useTranslation } from 'next-i18next';
import CollectionPlaylistCard from '../../../Cards/PlaylistCard/PlaylistCard';
import PlaylistModal from '../../../Modals/CollectionPlaylistModal/PlaylistModal';
import { useActions } from '../../../../hooks/useActions';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SpotiReq } from '../../../../lib/spotiReq';
import { Playlist } from '../../../../types/playlist';
import { modalCollectionPos, modalClose } from '../../../../lib/helper';

interface PlaylistsSectionProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	playlistsArray: Playlist[];
	usage?: 'selectedPlaylist' | 'collectionPlaylist' | 'mainPage';
	headerText?: string;
}

const PlaylistsSection: FC<PlaylistsSectionProps> = ({
	className,
	usage,
	headerText,
	playlistsArray,
	...props
}) => {
	const { t } = useTranslation('mainview');
	const { currentUser, userPlaylists } = useTypedSelector(
		(state) => state.server
	);
	const { collectionPlaylistState, shouldLoading } = useTypedSelector(
		(state) => state.client
	);
	const {
		setCollectionPlaylistModalState,
		setPlaylist,
		setLoadingContent,
		setEditModalState,
	} = useActions();
	const { data: session } = useSession();
	const [fetching, setFetching] = useState<boolean>(false);
	const { asPath } = useRouter();
	const refModal = useRef<HTMLDivElement>(null);
	const refPlaylistItem = useRef<Array<HTMLDivElement | null>>([]);

	useEffect(() => {
		(async () => {
			try {
				if (shouldLoading === true) {
					const playlists = await SpotiReq()
						.getUserPlaylists(
							50,
							playlistsArray.length,
							session?.user.accessToken
						)
						.then((res) => {
							return res ? res.json() : null;
						});
					setPlaylist({
						playlistsArray: [...playlistsArray, ...playlists.items],
						total: playlists.total,
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
		if (!refModal || !refPlaylistItem) return;
		async function contextMenuClick(event: any) {
			try {
				event.preventDefault();
				if (collectionPlaylistState.isOpened) {
					if (
						refModal.current &&
						!refModal.current.contains(event.target)
					) {
						setCollectionPlaylistModalState({
							...modalClose,
						});
					}
				}
				if (
					refPlaylistItem.current &&
					refPlaylistItem.current.includes(event.target)
				) {
					const playlistId = refPlaylistItem?.current?.find(
						(item: any) => item === event.target
					)?.id;
					const coords = modalCollectionPos(
						event,
						refModal,
						playlistId,
						true
					);
					const res =
						asPath !== '/collection/playlists'
							? await SpotiReq()
									.checkFollowPlaylist(
										playlistId!.slice(3),
										currentUser.id,
										session?.user.accessToken
									)
									.then((res) => {
										return res ? res.json() : null;
									})
							: [true];

					setCollectionPlaylistModalState({
						...coords,
						inLibrary: res[0],
					});
				}
			} catch (e) {
				console.log(e);
			}
		}

		function handleClick(event: any) {
			if (collectionPlaylistState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setCollectionPlaylistModalState({
						...modalClose,
					});
				}
			}
		}

		function handleScroll(event: any) {
			if (collectionPlaylistState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setCollectionPlaylistModalState({
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
		refPlaylistItem,
		collectionPlaylistState,
		collectionPlaylistState.id,
		setCollectionPlaylistModalState,
		asPath,
		currentUser.id,
		session?.user.accessToken,
	]);
	const deletePlaylist = async (playlistId: string) => {
		setFetching(true);
		try {
			await SpotiReq().removePlaylistFromLibrary(
				playlistId,
				session?.user.accessToken
			);
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setCollectionPlaylistModalState({
				...modalClose,
			});
			setPlaylist({
				playlistsArray: userPlaylists.playlistsArray.filter(
					(item: Playlist) => item.id !== playlistId
				),
				total: userPlaylists.total - 1,
			});
		}
	};
	const addPlaylistToLibrary = async (playlistId: string) => {
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
			setCollectionPlaylistModalState({
				...modalClose,
			});
		}
	};
	const editPlaylist = async (id: string) => {
		setFetching(true);
		try {
			const playlist = await SpotiReq()
				.getPlaylist(id, session?.user.accessToken)
				.then((res) => (res ? res.json() : []));

			setEditModalState({
				isOpened: true,
				id: playlist.id,
				name: playlist.name,
				description: playlist.description,
				image: playlist?.images[0]?.url || '',
			});
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setCollectionPlaylistModalState({
				...modalClose,
			});
		}
	};
	const addQueue = (a: string) => {
		console.log(a);
	};

	return (
		<>
			<section
				className={cn(className, styles.playlistsSection)}
				{...props}
			>
				<div className={styles.headerContainer}>
					{usage === 'mainPage' ? (
						<h2 className={styles.textContent}>{headerText}</h2>
					) : (
						<h1 className={styles.textContent}>
							{t('collection.playlists.header')}
						</h1>
					)}
				</div>
				<div className={styles.scrollableContainer}>
					<div className={styles.gridContainer}>
						{playlistsArray.splice.length > 0 ? (
							playlistsArray.map((item: any) => {
								return (
									<CollectionPlaylistCard
										item={item}
										key={item.id}
										ref={(el: HTMLDivElement) =>
											(
												refPlaylistItem as MutableRefObject<
													Array<HTMLDivElement | null>
												>
											).current.push(el)
										}
									/>
								);
							})
						) : (
							<p>{t('errors.playlistEmptyError')}</p>
						)}
					</div>
				</div>

				<PlaylistModal
					ref={refModal}
					style={{
						visibility: collectionPlaylistState.isOpened
							? 'visible'
							: 'hidden',
						opacity: collectionPlaylistState.isOpened ? 1 : 0,
						left: collectionPlaylistState.isOpened
							? `${collectionPlaylistState.x}px`
							: 0,
						top: collectionPlaylistState.isOpened
							? `${collectionPlaylistState.y}px`
							: 0,
					}}
					fetching={fetching}
					setFetching={setFetching}
					inLibrary={collectionPlaylistState.inLibrary}
					deletePlaylist={deletePlaylist}
					addPlaylistToLibrary={addPlaylistToLibrary}
					editPlaylist={editPlaylist}
					addQueue={addQueue}
				/>
			</section>
		</>
	);
};

export default React.memo(PlaylistsSection);
