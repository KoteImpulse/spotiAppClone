import React, { FC, ForwardedRef, forwardRef } from 'react';
import cn from 'classnames';
import styles from './ArtistCard.module.scss';
import { HTMLMotionProps, motion, Variants } from 'framer-motion';
import Image from 'next/image';
import CardPlayButton from '../../Buttons/CardPlayButton/CardPlayButton';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

interface ArtistCardProps extends HTMLMotionProps<'div'> {
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

const ArtistCard = ({
	className,
	item,
	...props
}: ArtistCardProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
	const { t } = useTranslation('mainview');

	const router = useRouter();

	const clickHandler = (e: any) => {
		e.stopPropagation();
		console.log('object');
	};

	return (
		<motion.div
			className={cn(className, styles.artistCard)}
			{...props}
			variants={hoverCardVariants}
			whileHover={'hover'}
			initial={'rest'}
			onClick={() => router.push(`/artist/${item.id}`)}
			ref={ref}
			id={item.id}
		>
			<div className={styles.cardContainer}>
				<div className={styles.imageBlock}>
					<div className={styles.imageContainer}>
						<div className={styles.container}>
							{item?.images.length > 0 ? (
								<Image
									src={`https://res.cloudinary.com/demo/image/fetch/${item?.images[1].url}`}
									className={styles.nextImage}
									alt={item.name || 'picture'}
									width={180}
									height={180}
									quality={40}
									objectFit="cover"
								/>
							) : (
								<Image
									src={'/noImg.png'}
									className={styles.nextImage}
									alt={'no picture'}
									width={180}
									height={180}
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
							{`${t('collection.artists.artist')}`}
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default React.memo(motion(forwardRef(ArtistCard)));
