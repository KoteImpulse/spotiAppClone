import React, { FC, ReactNode } from 'react';
import cn from 'classnames';
import styles from './PlaylistPlayButton.module.scss';
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion';
import { IoPlay } from 'react-icons/io5';

interface PlaylistPlayButtonProps extends HTMLMotionProps<'button'> {
	ariaLabel: string;
	size:number;
	content?: string;
	fetching:boolean;
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

const PlaylistPlayButton: FC<PlaylistPlayButtonProps> = ({
	ariaLabel,size,
	content,
	className,fetching,
	...props
}) => {
	const contrls = useAnimation();
	return (
		<motion.button
			aria-label={ariaLabel}
			className={cn(className, styles.playlistPlayButton)}
			initial='rest'
			variants={hoverVariants}
			animate={contrls}
			onHoverStart={() => contrls.start('hover')}
			onHoverEnd={() => contrls.start('rest')}
			disabled={fetching}
			style={
				fetching ? { cursor: 'not-allowed' } : { cursor: 'default' }
			}
			{...props}
		>
			<div className={styles.innerButton} style={{width: `${size}px`, height: `${size}px`}}>
				<span className={styles.icon}>
					<IoPlay />
				</span>
				{content && (
					<span className={styles.textContent}>{content}</span>
				)}
			</div>
		</motion.button>
	);
};

export default PlaylistPlayButton;
