import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
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

interface NavbarProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Navbar: FC<NavbarProps> = ({ className, ...props }) => {
	const { t } = useTranslation('navbar');
	const { navbarModalState } = useTypedSelector((state) => state.client);
	const { setNavbarModalState, setPlaylist } = useActions();
	const { data: session } = useSession();

	const [fetching, setFetching] = useState<boolean>(false);

	const refModal = useRef<HTMLDivElement>(null);
	const refLinkItem = useRef<Array<HTMLAnchorElement | null>>([]);

	useEffect(() => {
		if (!refModal || !refLinkItem) return;

		function contextMenuClick(event: any) {
			event.preventDefault();
			let xPosition = 0;
			let yPosition = 0;
			if (navbarModalState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setNavbarModalState({
						isOpened: false,
						playlistId: '',
						x: 0,
						y: 0,
					});
				}
			}
			if (
				refLinkItem.current &&
				refLinkItem.current.includes(event.target)
			) {
				const playlistId = refLinkItem?.current?.find(
					(item: any) => item === event.target
				)?.id;

				let mouseX = event.clientX || event.touches[0].clientX;
				let mouseY = event.clientY || event.touches[0].clientY;
				let menuHeight =
					refModal?.current?.getBoundingClientRect().height;
				let height = window.innerHeight;

				if (menuHeight) {
					if (height - mouseY - 90 >= menuHeight) {
						xPosition = mouseX;
						yPosition = mouseY;
					} else {
						xPosition = mouseX;
						yPosition = mouseY - menuHeight;
					}
				}

				setNavbarModalState({
					isOpened: true,
					playlistId: playlistId || '',
					x: xPosition,
					y: yPosition,
				});
			}
		}

		function handleClick(event: any) {
			if (navbarModalState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setNavbarModalState({
						isOpened: false,
						playlistId: '',
						x: 0,
						y: 0,
					});
				}
			}
		}

		function handleScroll(event: any) {
			if (navbarModalState.isOpened) {
				if (
					refModal.current &&
					!refModal.current.contains(event.target)
				) {
					setNavbarModalState({
						isOpened: false,
						playlistId: '',
						x: 0,
						y: 0,
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
	}, [refModal, refLinkItem, navbarModalState, navbarModalState.playlistId]);

	const deletePlaylist = async (playlistId: string) => {
		setFetching(true);
		try {
			if (!playlistId) return;
			await fetch(
				`https://api.spotify.com/v1/playlists/${playlistId}/followers`,
				{
					headers: {
						Authorization: `Bearer ${session?.user.accessToken}`,
					},
					method: 'DELETE',
				}
			);
			setNavbarModalState({
				isOpened: false,
				playlistId: '',
				x: 0,
				y: 0,
			});
			const playlists = await fetch(
				`https://api.spotify.com/v1/me/playlists?offset=0&limit=50`,
				{
					headers: {
						Authorization: `Bearer ${session?.user.accessToken}`,
					},
				}
			).then((res) => {
				return res ? res.json() : null;
			});
			if (playlists) {
				setPlaylist(playlists.items);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
		}
	};

	return (
		<div
			aria-label={t('ariaLabelMain')}
			className={cn(className, styles.navbar)}
			{...props}
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
				fetching={fetching}
			/>
		</div>
	);
};

export default Navbar;
