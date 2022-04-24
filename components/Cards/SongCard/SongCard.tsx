import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './SongCard.module.scss';
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5';
import { HTMLMotionProps, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { msToTime } from '../../../lib/helper';
import LikeButton from '../../Buttons/LikeButton/LikeButton';
import { useActions } from '../../../hooks/useActions';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useSession } from 'next-auth/react';
import { SpotiReq } from '../../../lib/spotiReq';
import useSpotify from '../../../hooks/useSpotify';

interface SongCardProps extends HTMLMotionProps<'div'> {
	song: any;
	artists: any[];
	index: number;
	duration: number;
	fetching: boolean;
	isLiked: boolean;
	usage: 'album' | 'artist' | 'playlist' | 'recommendation';
	likeSong: (a: string, b?: boolean) => void;
	album?: any;
	added_at?: string;
	isSelected?: boolean;
}

const SongCard = (
	{
		usage,
		likeSong,
		isSelected,
		song,
		artists,
		album,
		duration,
		added_at,
		index,
		isLiked,
		fetching,
		className,
		...props
	}: SongCardProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { locale, asPath } = useRouter();
	const { t } = useTranslation('common');

	const { setSongData, setCurrentSong, setIsPlaying } = useActions();
	const { songData, currentSong, isPlaying } = useTypedSelector(
		(state) => state.client
	);
	const [inLibrary, setinLibrary] = useState<boolean>(isLiked);
	const { data: session } = useSession();
	const simpleDateFormat = new Date(added_at ? added_at : '').toLocaleString(
		locale,
		{
			month: 'long',
			year: 'numeric',
			day: '2-digit',
		}
	);

	const playsong = async () => {
		setIsPlaying(false);
		try {
			const track = await SpotiReq()
				.getTrack(song.id, session?.user?.accessToken)
				.then((res) => (res ? res.json() : null));
			setCurrentSong(track);

			// await fetch(
			// 	`https://api.spotify.com/v1/me/player/play}`,
			// 	{
			// 		headers: {
			// 			Authorization: `Bearer ${session?.user?.accessToken}`,
			// 		},
			// 		method: 'PUT',
			// 		body: JSON.stringify({
			// 			uris: [`${currentSong.uri}`],
			// 		}),
			// 	}
			// );
		} catch (e) {
			console.log(e);
		} finally {
			setIsPlaying(true);
		}
	};

	useEffect(() => {
		setSongData({ songId: '', songURI: '' });
	}, [asPath]);

	useEffect(() => {}, [isPlaying]);

	return (
		<motion.div
			className={cn(className, styles.songCard, {
				[styles.isSelected]: isSelected,
			})}
			{...props}
			ref={ref}
			id={song.id}
			onClick={() => setSongData({ songId: song.id, songURI: song.uri })}
		>
			<div
				className={cn(styles.song, {
					[styles.songAlbum]: usage === 'album',
					[styles.songArtist]: usage === 'artist',
					[styles.songPlaylist]: usage === 'playlist',
					[styles.songRecommendation]: usage === 'recommendation',
				})}
			>
				<div className={styles.index}>
					<motion.div className={styles.indexContainer}>
						<motion.span
							className={cn(styles.text, {
								[styles.isSelected]: isSelected,
							})}
						>
							{index + 1}
						</motion.span>
						<motion.button
							className={cn(styles.button, {
								[styles.isSelected]: isSelected,
							})}
							aria-label={
								isPlaying
									? `${t('songItem.songPauseButtonAria')}`
									: `${t('songItem.songPlayButtonAria')}`
							}
							onClick={() => playsong()}
						>
							{isPlaying && song.id === currentSong?.id ? (
								<IoPauseOutline />
							) : (
								<IoPlayOutline />
							)}
						</motion.button>
					</motion.div>
				</div>
				<div className={styles.title}>
					{album && (
						<div className={styles.imageContainer}>
							<Image
								src={`https://res.cloudinary.com/demo/image/fetch/${album.images[2].url}`}
								layout='fixed'
								width={40}
								height={40}
								alt={song.name}
								className={styles.image}
								quality={40}
							/>
						</div>
					)}
					<div className={styles.textBlock}>
						<div className={styles.songName}>{song.name}</div>
						{usage !== 'artist' && (
							<span className={styles.artist}>
								{artists.map((item: any) => (
									<Link
										key={item.id}
										href={`/artist/${item.id}`}
										scroll
									>
										<a
											className={styles.artistLink}
											aria-label={`${t(
												'songItem.songArtistLinkAria'
											)} ${item.name} `}
										>
											{` ${item.name} `}
										</a>
									</Link>
								))}
							</span>
						)}
					</div>
				</div>
				{album && usage !== 'artist' && (
					<div className={styles.album}>
						<span className={styles.albumName}>
							<Link href={`/album/${album.id}`} scroll>
								<a
									className={styles.albumLink}
									aria-label={`${t(
										'songItem.songAlbumLinkAria'
									)} ${album.name}`}
								>
									{album.name}
								</a>
							</Link>
						</span>
					</div>
				)}
				{added_at && (
					<div className={styles.dateAdded}>
						<span className={styles.dateAdded}>
							{simpleDateFormat}
						</span>
					</div>
				)}
				<div className={styles.duration}>
					<LikeButton
						className={cn(styles.like, {
							[styles.isSelected]: isSelected,
							[styles.isLiked]: isLiked,
						})}
						ariaLabel={
							inLibrary
								? `${t('songItem.songdUnLikeButtonAria')} ${
										song.name
								  }`
								: `${t('songItem.songdLikeButtonAria')} ${
										song.name
								  }`
						}
						usage='song'
						size={15}
						id={song.id}
						isLiked={inLibrary}
						fetching={fetching}
						like={likeSong}
					/>
					<span className={styles.durationTime}>
						{msToTime(duration)}
					</span>
				</div>
			</div>
		</motion.div>
	);
};

export default React.memo(motion(forwardRef(SongCard)));
