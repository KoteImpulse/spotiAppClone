import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './Navbar.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarLinksBlock from '../NavbarLinksBlock/NavbarLinksBlock';
import NavbarButtonsBlock from '../NavbarButtonsBlock/NavbarButtonsBlock';
import NavbarLogoBlock from '../NavbarLogoBlock/NavbarLogoBlock';
import NavbarPlaylistsBlock from '../NavbarPlaylistsBlock/NavbarPlaylistsBlock';
import { useActions } from '../../../hooks/useActions';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useSession } from 'next-auth/react';
import NavbarModal from '../../Modals/NavbarModal/NavbarModal';
import { useRouter } from 'next/router';
import { SpotiReq } from '../../../lib/spotiReq';
import { Playlist } from '../../../types/playlist';
import { modalNavbarPos, modalNavClose } from '../../../lib/helper';

interface NavbarProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Navbar: FC<NavbarProps> = ({ className, ...props }) => {
	const { t } = useTranslation('navbar');
	const { navbarModalState } = useTypedSelector((state) => state.client);
	const { userPlaylists } = useTypedSelector((state) => state.server);
	const { setNavbarModalState, setPlaylist, setEditModalState } =
		useActions();
	const { data: session } = useSession();

	const [fetching, setFetching] = useState<boolean>(false);

	const router = useRouter();

	const refModal = useRef<HTMLDivElement>(null);
	const refLinkItem = useRef<Array<HTMLAnchorElement | null>>([]);

	useEffect(() => {
		if (!refModal || !refLinkItem) return;

		function contextMenuClick(event: any) {
			event.preventDefault();
			if (navbarModalState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setNavbarModalState({ ...modalNavClose });
				}
			}
			if (
				refLinkItem.current &&
				refLinkItem.current.includes(event.target)
			) {
				const playlistId = refLinkItem?.current?.find(
					(item: any) => item === event.target
				)?.id;

				const coords = modalNavbarPos(event, refModal, playlistId);
				setNavbarModalState({ ...coords });
			}
		}

		function handleClick(event: any) {
			if (navbarModalState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setNavbarModalState({ ...modalNavClose });
				}
			}
		}

		function handleScroll(event: any) {
			if (navbarModalState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setNavbarModalState({ ...modalNavClose });
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
	}, [refModal, refLinkItem, navbarModalState, navbarModalState.playlistId]);

	useEffect(() => {}, [userPlaylists]);

	const deletePlaylist = async (playlistId: string) => {
		setFetching(true);
		try {
			if (!playlistId) return;
			await SpotiReq().removePlaylistFromLibrary(
				playlistId,
				session?.user.accessToken
			);
			setNavbarModalState({ ...modalNavClose });

			if (playlistId === router.asPath.split('/')[2]) {
				router.push('/collection/playlists');
			}
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setPlaylist({
				playlistsArray: userPlaylists.playlistsArray.filter(
					(item: Playlist) => item.id !== playlistId
				),
				total: userPlaylists.total - 1,
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
			setNavbarModalState({ ...modalNavClose });
		}
	};

	const sizerRef = useRef<HTMLDivElement>(null);
	const sizerInnerRef = useRef<HTMLDivElement>(null);
	const [valueSize, setValueSize] = useState(250);
	const dragging = useRef(false);

	const handleMouseMove = useCallback((e) => {
		if (!dragging.current) {
			return;
		}
		setValueSize((prev) => {
			if (e.clientX < 250) {
				return 250;
			}
			if (e.clientX > 320) {
				return 320;
			}
			return e.clientX;
		});
	}, []);

	const handleMouseDown = useCallback((e: any) => {
		dragging.current = true;
	}, []);

	const handleMouseUp = useCallback((e) => {
		if (!dragging.current) {
			return;
		}
		setValueSize((prev) => {
			if (e.clientX < 250) {
				return 250;
			}
			if (e.clientX > 320) {
				return 320;
			}
			return e.clientX;
		});
		dragging.current = false;
	}, []);

	useEffect(() => {
		if (!sizerRef) return;
		const sizerInnerRefConst = sizerInnerRef?.current;

		sizerInnerRefConst?.addEventListener('mousedown', handleMouseDown);
		window?.addEventListener('mousemove', handleMouseMove);
		window?.addEventListener('mouseup', handleMouseUp);
		return () => {
			sizerInnerRefConst?.removeEventListener(
				'mousedown',
				handleMouseDown
			);
			window?.addEventListener('mousemove', handleMouseMove);
			window?.addEventListener('mouseup', handleMouseUp);
		};
	}, [handleMouseDown, handleMouseMove, handleMouseUp]);

	return (
		<div
			aria-label={t('ariaLabelMain')}
			className={cn(className, styles.navbar)}
			{...props}
			style={{ width: `calc(${valueSize}px + 9px)` }}
		>
			<NavbarLogoBlock />
			<NavbarLinksBlock />
			<div className={styles.playlistBlock}>
				<div className={styles.playlists}>
					<NavbarButtonsBlock />
					<div className={styles.divider}>
						<hr />
					</div>
					<div className={styles.listContainer}>
						<NavbarPlaylistsBlock ref={refLinkItem} />
					</div>
				</div>
			</div>
			<div className={styles.sizer}>
				<div
					className={styles.value}
					ref={sizerInnerRef}
					style={{ left: `calc(${valueSize}px + 4.5px) ` }}
				></div>
			</div>
			<NavbarModal
				ref={refModal}
				style={{
					visibility: navbarModalState.isOpened
						? 'visible'
						: 'hidden',
					opacity: navbarModalState.isOpened ? 1 : 0,
					left: navbarModalState.isOpened
						? `${navbarModalState.x}px`
						: 0,
					top: navbarModalState.isOpened
						? `${navbarModalState.y}px`
						: 0,
				}}
				deletePlaylist={deletePlaylist}
				editPlaylist={editPlaylist}
				fetching={fetching}
			/>
		</div>
	);
};

export default Navbar;
