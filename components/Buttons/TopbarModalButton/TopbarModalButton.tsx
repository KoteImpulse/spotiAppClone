import React, { FC } from 'react';
import cn from 'classnames';
import styles from './TopbarModalButton.module.scss';
import { HTMLMotionProps, motion, Variants } from 'framer-motion';

interface TopbarModalButtonProps extends HTMLMotionProps<'button'> {
	ariaLabel: string;
	content: string;
}

const hoverVariants: Variants = {
	hover: {
		backgroundColor: 'var(--background-profile-modal-hover)',
		color: 'var(--text-hover)',
		transition: { duration: 0.1 },
	},
	rest: {
		backgroundColor: 'var(--background-profile-modal)',
		color: 'var(--text-base)',
		transition: { duration: 0.1 },
	},
	active: {
		backgroundColor: 'var(--background-profile-modal-hover)',
		color: 'var(--text-hover)',
		transition: { duration: 0.1 },
	},
};

const TopbarModalButton: FC<TopbarModalButtonProps> = ({
	ariaLabel,
	content,
	className,
	...props
}) => {
	return (
		<motion.button
			className={cn(className, styles.topbarModalButton)}
			aria-label={ariaLabel}
			whileHover='hover'
			initial='rest'
			variants={hoverVariants}
			{...props}
		>
			<span className={styles.textContent}>{content}</span>
		</motion.button>
	);
};

export default TopbarModalButton;
