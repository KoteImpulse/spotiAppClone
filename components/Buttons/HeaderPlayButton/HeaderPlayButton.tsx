import React, { FC, ReactNode } from 'react';
import cn from 'classnames';
import styles from './HeaderPlayButton.module.scss';
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion';
import { IoPlay } from 'react-icons/io5';

interface HeaderPlayButtonProps extends HTMLMotionProps<'button'> {
	ariaLabel: string;
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

const HeaderPlayButton: FC<HeaderPlayButtonProps> = ({
	ariaLabel,
	content,
	className,
	...props
}) => {
	const contrls = useAnimation();
	return (
		<motion.button
			aria-label={ariaLabel}
			className={cn(className, styles.headerPlayButton)}
			initial='rest'
			variants={hoverVariants}
			animate={contrls}
			onHoverStart={() => contrls.start('hover')}
			onHoverEnd={() => contrls.start('rest')}
			{...props}
			
		>
			<div className={styles.innerButton}>
				<span className={styles.icon}><IoPlay /></span>
				<span className={styles.textContent}>{content}</span>
			</div>
		</motion.button>
	);
};

export default HeaderPlayButton;
