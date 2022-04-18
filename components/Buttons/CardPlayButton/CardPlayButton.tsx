import React, { FC, ForwardedRef, forwardRef } from 'react';
import cn from 'classnames';
import styles from './CardPlayButton.module.scss';
import { HTMLMotionProps, motion } from 'framer-motion';
import { IoPlay } from 'react-icons/io5';

interface CardPlayButtonProps extends HTMLMotionProps<'button'> {
	ariaLabel: string;
	content?: string;
}

const CardPlayButton = (
	{ ariaLabel, content, className, ...props }: CardPlayButtonProps,
	ref: ForwardedRef<HTMLButtonElement>
): JSX.Element => {
	return (
		<motion.button
			aria-label={ariaLabel}
			className={cn(className, styles.cardPlayButton)}
			{...props}
			ref={ref}
		>
			<div className={styles.innerButton}>
				<span className={styles.icon}>
					<IoPlay />
				</span>
			</div>
		</motion.button>
	);
};

export default motion(forwardRef(CardPlayButton));
