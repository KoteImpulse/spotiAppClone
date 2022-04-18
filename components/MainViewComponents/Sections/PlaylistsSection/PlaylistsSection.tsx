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

interface PlaylistsSectionProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	playlistsArray: Playlist[];
}

const PlaylistsSection: FC<PlaylistsSectionProps> = ({
	className,
	playlistsArray,
	...props
}) => {
	const { t } = useTranslation('mainview');
	const { currentUser } = useTypedSelector((state) => state.server);
	const { collectionPlaylistState } = useTypedSelector(
		(state) => state.client
	);
	const { setCollectionPlaylistModalState, setPlaylist } = useActions();
	const { data: session } = useSession();
	const [fetching, setFetching] = useState<boolean>(false);
	const { asPath } = useRouter();
	const refModal = useRef<HTMLDivElement>(null);
	const refPlaylistItem = useRef<Array<HTMLDivElement | null>>([]);

	useEffect(() => {
		if (!refModal || !refPlaylistItem) return;
		async function contextMenuClick(event: any) {
			try {
				let xPosition = 0;
				let yPosition = 0;
				event.preventDefault();
				if (collectionPlaylistState.isOpened) {
					if (
						refModal.current &&
						!refModal.current.contains(event.target)
					) {
						setCollectionPlaylistModalState({
							isOpened: false,
							playlistId: '',
							x: 0,
							y: 0,
							height: 0,
							width: 0,
							inLibrary: false,
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

					setCollectionPlaylistModalState({
						isOpened: true,
						playlistId: playlistId?.slice(3) || '',
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
			if (collectionPlaylistState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setCollectionPlaylistModalState({
						isOpened: false,
						playlistId: '',
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
			if (collectionPlaylistState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setCollectionPlaylistModalState({
						isOpened: false,
						playlistId: '',
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
		refPlaylistItem,
		collectionPlaylistState,
		collectionPlaylistState.playlistId,
	]);

	const deletePlaylist = async (playlistId: string) => {
		setFetching(true);
		try {
			await SpotiReq().removePlaylistFromLibrary(
				playlistId,
				session?.user.accessToken
			);
			const playlists = await SpotiReq()
				.getUserPlaylists(session?.user.accessToken)
				.then((res) => {
					return res ? res.json() : null;
				});
			if (playlists.items.length >= 0) {
				setPlaylist(playlists.items);
			}
		} catch (e) {
			console.log(e);
			setPlaylist([]);
		} finally {
			setFetching(false);
		}
		setCollectionPlaylistModalState({
			isOpened: false,
			playlistId: '',
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			inLibrary: false,
		});
	};

	const addPlaylistToLibrary = (a: string) => {
		console.log(a);
	};
	const editPlaylist = (a: string) => {
		console.log(a);
	};
	const addQueue = (a: string) => {
		console.log(a);
	};
	const toRadio = (a: string) => {
		console.log(a);
	};

	return (
		<>
			<section
				className={cn(className, styles.playlistsSection)}
				{...props}
			>
				<div className={styles.headerContainer}>
					<h1 className={styles.textContent}>
						{t('collection.playlists.header')}
					</h1>
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
					inLibrary={collectionPlaylistState.inLibrary}
					deletePlaylist={deletePlaylist}
					addPlaylistToLibrary={addPlaylistToLibrary}
					editPlaylist={editPlaylist}
					addQueue={addQueue}
					toRadio={toRadio}
				/>
			</section>
		</>
	);
};

export default React.memo(PlaylistsSection);
