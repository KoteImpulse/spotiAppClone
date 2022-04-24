import React, { FC, useState } from 'react';
import cn from 'classnames';
import styles from './LikeButton.module.scss';
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';

interface LikeButtonProps extends HTMLMotionProps<'button'> {
	ariaLabel: string;
	usage: 'playlist' | 'song' | 'album' | 'artist';
	id: string;
	isLiked: boolean;
	size: number;
	fetching: boolean;
	like: (a: string, b?: boolean) => void;
	content?: string;
}

const hoverVariants: Variants = {
	hover: {
		scale: 1.08,
		transition: {
			ease: 'easeOut',
			duration: 0,
		},
	},
	rest: {
		scale: 1.0,
		transition: {
			ease: 'easeOut',
			duration: 0,
		},
	},
	active: {
		scale: 1.08,
		transition: {
			ease: 'easeOut',
			duration: 0,
		},
	},
};

const LikeButton: FC<LikeButtonProps> = ({
	ariaLabel,
	like,
	id,
	isLiked,
	usage,
	size,
	content,
	className,
	fetching,
	...props
}) => {
	const contrls = useAnimation();

	const [inLibrary, setInLibrary] = useState<boolean>(isLiked);
	const clickHandler = () => {
		if (usage === 'playlist') {
			like(id);
		} else if (usage === 'song') {
			inLibrary ? setInLibrary(false) : setInLibrary(true);
			like(id, inLibrary);
		} else if (usage === 'artist') {
			like(id);
		} else {
			like(id);
		}
	};
	return (
		<motion.button
			aria-label={ariaLabel}
			className={cn(className, styles.likeButton)}
			initial='rest'
			variants={hoverVariants}
			animate={contrls}
			onHoverStart={() => contrls.start('hover')}
			onHoverEnd={() => contrls.start('rest')}
			onClick={() => clickHandler()}
			disabled={fetching}
			style={fetching ? { cursor: 'not-allowed' } : { cursor: 'default' }}
			{...props}
		>
			<div
				className={styles.innerButton}
				style={{
					width: `${size}px`,
					height: `${size}px`,
					color:
						usage === 'song'
							? inLibrary
								? 'var(--positive)'
								: 'var(--text)'
							: isLiked
							? 'var(--positive)'
							: 'var(--text)',
				}}
			>
				<span className={styles.icon} style={{ fontSize: `${size}px` }}>
					{usage !== 'song' ? (
						isLiked ? (
							<IoHeart />
						) : (
							<IoHeartOutline />
						)
					) : inLibrary ? (
						<IoHeart />
					) : (
						<IoHeartOutline />
					)}
				</span>
				{content && (
					<span className={styles.textContent}>{content}</span>
				)}
			</div>
		</motion.button>
	);
};

export default React.memo(LikeButton);
