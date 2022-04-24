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
import { modalClose, modalCollectionPos } from '../../../../lib/helper';

interface ArtistsSectionProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	artistsArray: Artist[];
	usage: 'selectedArtist' | 'collectionArtists' | "mainPage";
	headerText?: string;
}

const ArtistsSection: FC<ArtistsSectionProps> = ({
	className,
	headerText,
	usage,
	artistsArray,
	...props
}) => {
	const { t } = useTranslation('mainview');
	const { collectionArtistState, shouldLoading } = useTypedSelector(
		(state) => state.client
	);
	const { followingArtists } = useTypedSelector((state) => state.server);
	const { setCollectionArtistModalState, setArtists, setLoadingContent } =
		useActions();
	const { data: session } = useSession();
	const [fetching, setFetching] = useState<boolean>(false);
	const { asPath } = useRouter();

	const refModal = useRef<HTMLDivElement>(null);
	const refArtistItem = useRef<Array<HTMLDivElement | null>>([]);

	useEffect(() => {
		(async () => {
			try {
				if (shouldLoading === true) {
					const res = await SpotiReq()
						.getArtists(
							50,
							session?.user.accessToken,
							artistsArray[artistsArray.length - 1].id
						)
						.then((res) => {
							return res ? res.json() : null;
						});
					setArtists({
						artistsArray: [...artistsArray, ...res.artists.items],
						total: res.artists.total,
						liked: [],
					});
				}
			} catch (e: any) {
				console.log(e);
			} finally {
				setLoadingContent(false);
			}
		})();
	}, [shouldLoading]);
	useEffect(() => {
		if (!refModal || !refArtistItem) return;
		async function contextMenuClick(event: any) {
			try {
				event.preventDefault();
				if (collectionArtistState.isOpened) {
					if (
						refModal.current &&
						!refModal.current.contains(event.target)
					) {
						setCollectionArtistModalState({
							...modalClose,
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
					const coords = modalCollectionPos(
						event,
						refModal,
						artistId
					);
					const res =
						asPath !== '/collection/artists'
							? await SpotiReq()
									.checkFollowArtist(
										artistId!,
										session?.user.accessToken
									)
									.then((res) => {
										return res ? res.json() : null;
									})
							: [true];

					setCollectionArtistModalState({
						...coords,
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
						...modalClose,
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
		refArtistItem,
		collectionArtistState,
		collectionArtistState.id,
		setCollectionArtistModalState,
		asPath,
		session?.user.accessToken,
	]);

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
			...modalClose,
		});
	};
	const unFollowArtist = async (artistId: string) => {
		setFetching(true);
		try {
			await SpotiReq().unFollowArtist(
				artistId,
				session?.user.accessToken
			);
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setArtists({
				artistsArray: artistsArray.filter(
					(item: Artist) => item.id !== artistId
				),
				total: followingArtists.total - 1,
				liked: [],
			});
			setCollectionArtistModalState({
				...modalClose,
			});
		}
	};

	return (
		<section className={cn(className, styles.artistsSection)} {...props}>
			<div className={styles.headerContainer}>
				{usage === 'selectedArtist' ? (
					<h1 className={styles.textContent}>{headerText}</h1>
				) : (
					<h2 className={styles.textContent}>{headerText}</h2>
				)}
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
				setFetching={setFetching}
				inLibrary={collectionArtistState.inLibrary}
				followArtist={followArtist}
				unFollowArtist={unFollowArtist}
			/>
		</section>
	);
};

export default React.memo(ArtistsSection);
