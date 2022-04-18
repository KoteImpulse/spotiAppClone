import React, { ForwardedRef, forwardRef, useState } from 'react';
import cn from 'classnames';
import styles from './SongCard.module.scss';
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5';
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { msToTime } from '../../../lib/helper';
import { Track } from '../../../types/song';
import LikeButton from '../../Buttons/LikeButton/LikeButton';

interface SongCardProps extends HTMLMotionProps<'div'> {
	track: Track;
	index: number;
	fetching: boolean;
	isLiked: boolean;
}

const SongCard = (
	{ index, isLiked, track, fetching, className, ...props }: SongCardProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { locale } = useRouter();
	const { t } = useTranslation('common');

	const [selected, setSelected] = useState(false);

	const isPlaying = false;

	const controls = useAnimation();

	const simpleDateFormat = new Date(track.added_at).toLocaleString(locale, {
		month: 'long',
		year: 'numeric',
		day: '2-digit',
	});

	const hoverButtonLiked: Variants = {
		hover: {
			opacity: 1,
			transition: {
				duration: 0,
			},
		},
		rest: {
			opacity: 1,
			transition: {
				duration: 0,
			},
		},
	};
	const hoverButtonLike: Variants = {
		hover: {
			opacity: 1,
			transition: {
				duration: 0,
			},
		},
		rest: {
			opacity: 0,
			transition: {
				duration: 0,
			},
		},
	};
	const hoverButtonPlaying: Variants = {
		hover: {
			opacity: 1,
			transition: {
				duration: 0,
			},
		},
		rest: {
			opacity: 1,
			transition: {
				duration: 0,
			},
		},
	};
	const hoverButtonPlay: Variants = {
		hover: {
			opacity: 1,
			transition: {
				duration: 0,
			},
		},
		rest: {
			opacity: 0,
			transition: {
				duration: 0,
			},
		},
	};
	const hoverIndexPlaying: Variants = {
		hover: {
			opacity: 0,
			transition: {
				duration: 0,
			},
		},
		rest: {
			opacity: 0,
			transition: {
				duration: 0,
			},
		},
	};
	const hoverIndex: Variants = {
		hover: {
			opacity: 0,
			transition: {
				duration: 0,
			},
		},
		rest: {
			opacity: 1,
			transition: {
				duration: 0,
			},
		},
	};
	const selectedCard: Variants = {
		hover: {
			backgroundColor: `rgba(255,255,255,.4)`,
			transition: {
				duration: 0,
			},
		},
		rest: {
			backgroundColor: `rgba(255,255,255,.4)`,
			transition: {
				duration: 0,
			},
		},
	};
	const hoverCard: Variants = {
		hover: {
			backgroundColor: `rgba(255,255,255,.1)`,
			transition: {
				duration: 0,
			},
		},
		rest: {
			backgroundColor: `rgba(0,0,0,0)`,
			transition: {
				duration: 0,
			},
		},
	};

	return (
		<motion.div
			className={cn(className, styles.songCard)}
			{...props}
			ref={ref}
			id={track.track.id}
			onHoverStart={() => controls.start('hover')}
			onHoverEnd={() => controls.start('rest')}
			initial='rest'
			animate={controls}
			variants={selected ? selectedCard : hoverCard}
			onClick={() => setSelected(!selected)}
		>
			<div className={styles.song}>
				<div className={styles.index}>
					<motion.div className={styles.indexContainer}>
						<motion.span
							className={styles.text}
							variants={
								selected
									? hoverIndexPlaying
									: isPlaying
									? hoverIndexPlaying
									: hoverIndex
							}
							animate={controls}
							initial='rest'
						>
							{index + 1}
						</motion.span>
						<motion.button
							className={styles.button}
							aria-label={
								isPlaying
									? `${t('songItem.songPauseButtonAria')}`
									: `${t('songItem.songPlayButtonAria')}`
							}
							variants={
								selected
									? hoverButtonPlaying
									: isPlaying
									? hoverButtonPlaying
									: hoverButtonPlay
							}
							animate={controls}
							initial='rest'
							onClick={() => console.log(track.track.id)}
						>
							{isPlaying ? <IoPauseOutline /> : <IoPlayOutline />}
						</motion.button>
					</motion.div>
				</div>
				<div className={styles.title}>
					<div className={styles.imageContainer}>
						<Image
							src={track.track.album.images[2].url}
							layout='fixed'
							width={40}
							height={40}
							alt={track.track.name}
							className={styles.image}
						/>
					</div>
					<div className={styles.textBlock}>
						<div className={styles.songName}>
							{track.track.name}
						</div>
						<span className={styles.artist}>
							{track.track.artists.map((item: any) => (
								<Link key={item.id} href={`/artist/${item.id}`}>
									<a
										className={styles.artistLink}
										aria-label={`${t(
											'songItem.songArtistLinkAria'
										)} ${item.name}`}
									>
										{item.name}
									</a>
								</Link>
							))}
						</span>
					</div>
				</div>
				<div className={styles.album}>
					<span className={styles.albumName}>
						<Link href={`/album/${track.track.album.id}`}>
							<a
								className={styles.albumLink}
								aria-label={`${t(
									'songItem.songAlbumLinkAria'
								)} ${track.track.album.name}`}
							>
								{track.track.album.name}
							</a>
						</Link>
					</span>
				</div>
				<div className={styles.dateAdded}>
					<span className={styles.dateAdded}>{simpleDateFormat}</span>
				</div>
				<div className={styles.duration}>
					<LikeButton
						className={styles.like}
						ariaLabel={
							isLiked
								? `${t('songItem.songdUnLikeButtonAria')} ${
										track.track.name
								  }`
								: `${t('songItem.songdLikeButtonAria')} ${
										track.track.name
								  }`
						}
						usage='song'
						size={15}
						id={track.track.id}
						isLiked={isLiked}
						fetching={fetching}
						like={() => console.log('a')}
						variants={
							selected
								? hoverButtonLiked
								: isLiked
								? hoverButtonLiked
								: hoverButtonLike
						}
						animate={isLiked ? 'hover' : controls}
						initial={'rest'}
					/>
					<span className={styles.durationTime}>
						{msToTime(track.track.duration_ms)}
					</span>
				</div>
			</div>
		</motion.div>
	);
};

export default React.memo(motion(forwardRef(SongCard)));
