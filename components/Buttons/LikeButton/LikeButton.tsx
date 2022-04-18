import React, { FC } from 'react';
import cn from 'classnames';
import styles from './LikeButton.module.scss';
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

interface LikeButtonProps extends HTMLMotionProps<'button'> {
	ariaLabel: string;
	usage: 'playlist' | 'song' | 'album';
	id: string;
	isLiked: boolean;
	size: number;
	fetching: boolean;
	like: (a: string) => void;
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
	const { selectedPlaylist } = useTypedSelector((state) => state.server);

	const clickHandler = () => {
		if (usage === 'playlist') {
			like(selectedPlaylist.id);
		} else if (usage === 'song') {
			console.log(id, 'song');
		} else {
			console.log(id, 'album');
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
					color: isLiked ? 'var(--positive)' : 'var(--text)',
				}}
			>
				<span className={styles.icon} style={{ fontSize: `${size}px` }}>
					{isLiked ? <IoHeart /> : <IoHeartOutline />}
				</span>
				{content && (
					<span className={styles.textContent}>{content}</span>
				)}
			</div>
		</motion.button>
	);
};

export default LikeButton;
