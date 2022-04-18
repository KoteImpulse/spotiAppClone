import React, { ForwardedRef, forwardRef } from 'react';
import cn from 'classnames';
import styles from './AlbumCard.module.scss';
import Link from 'next/link';
import { HTMLMotionProps, motion, Variants } from 'framer-motion';
import Image from 'next/image';
import CardPlayButton from '../../Buttons/CardPlayButton/CardPlayButton';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

interface AlbumCardProps extends HTMLMotionProps<'div'> {
	item: any;
}

const hoverCardVariants: Variants = {
	hover: {
		scale: 1.02,
		cursor: 'pointer',
		backgroundColor: `var(--background-card-hover)`,
		transition: {
			ease: 'easeOut',
			duration: 0.1,
		},
	},
	rest: {
		scale: 1.0,
		cursor: 'default',
		backgroundColor: `var(--background-card)`,
		transition: {
			ease: 'easeOut',
			duration: 0.1,
		},
	},
	active: {
		scale: 1.0,
		cursor: 'default',
		backgroundColor: `var(--background-card)`,
		transition: {
			ease: 'easeOut',
			duration: 0.1,
		},
	},
};

const hoverButtonVariants: Variants = {
	hover: {
		opacity: 1,
		visibility: 'visible',
		transition: {
			ease: 'easeOut',
			duration: 0.1,
		},
	},
	rest: {
		opacity: 0,
		visibility: 'hidden',
		transition: {
			ease: 'easeOut',
			duration: 0.1,
		},
	},
	active: {
		opacity: 1,
		visibility: 'visible',
		transition: {
			ease: 'easeOut',
			duration: 0.1,
		},
	},
};

const AlbumCard = (
	{ className, item, ...props }: AlbumCardProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');

	const router = useRouter();

	const clickHandler = (e: any) => {
		e.stopPropagation();
		console.log('object');
	};

	return (
		<motion.div
			className={cn(className, styles.albumCard)}
			{...props}
			variants={hoverCardVariants}
			whileHover={'hover'}
			initial={'rest'}
			onClick={() => router.push(`/album/${item.id}`)}
			ref={ref}
			id={item.id}
		>
			<div className={styles.cardContainer}>
				<div className={styles.imageBlock}>
					<div className={styles.imageContainer}>
						<div className={styles.container}>
							{item?.images.length > 0 ? (
								<Image
									src={item?.images[1].url}
									className={styles.nextImage}
									alt={'sdasd'}
									width={300}
									height={300}
									quality={60}
								/>
							) : (
								<Image
									src={'/noImg.png'}
									className={styles.nextImage}
									alt={'sdasd'}
									width={300}
									height={300}
									quality={60}
								/>
							)}
						</div>
					</div>
					<div className={styles.buttonContainer}>
						<CardPlayButton
							ariaLabel={`${t(
								'collection.artists.playButtonAria'
							)}`}
							variants={hoverButtonVariants}
							onClick={(e: any) => clickHandler(e)}
						/>
					</div>
				</div>
				<div className={styles.textBlock}>
					<span className={styles.link}>
						<span className={styles.textContent1}>{item.name}</span>
					</span>
					<div className={styles.textContainer}>
						<span className={styles.textContent2}>
							{item.artists.map((artist: any) => (
								<Link
									href={`/artist/${artist.id}`}
									key={artist.id}
									passHref
								>
									<a className={styles.textContent3}>
										{artist.name}{' '}
									</a>
								</Link>
							))}
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default React.memo(motion(forwardRef(AlbumCard)));
