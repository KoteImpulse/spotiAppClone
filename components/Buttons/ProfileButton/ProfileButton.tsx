import React, { ForwardedRef, forwardRef, ReactNode } from 'react';
import cn from 'classnames';
import styles from './ProfileButton.module.scss';
import { HTMLMotionProps, motion, Variants } from 'framer-motion';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

interface ProfileButtonProps extends HTMLMotionProps<'button'> {
	ariaLabel: string;
	icon1: ReactNode;
	icon2: ReactNode;
}

const hoverVariants: Variants = {
	hover: {
		backgroundColor: 'var(--background-profile-button-active)',
		transition: { duration: 0 },
	},
	rest: {
		backgroundColor: 'var(--background-profile-button)',
		transition: { duration: 0 },
	},
	active: {
		backgroundColor: 'var(--background-profile-button-active)',
		transition: { duration: 0 },
	},
};

const ProfileButton = (
	{ ariaLabel, icon1, icon2, className, ...props }: ProfileButtonProps,
	ref: ForwardedRef<HTMLButtonElement>
): JSX.Element => {
	const { topbarModalState } = useTypedSelector((state) => state.client);
	const { currentUser } = useTypedSelector((state) => state.server);

	return (
		<motion.button
			aria-label={ariaLabel}
			className={cn(className, styles.profileButton)}
			whileHover='hover'
			initial='rest'
			variants={hoverVariants}
			{...props}
			ref={ref}
		>
			<span className={styles.icon1}>{icon1}</span>
			<span className={styles.textContent}>
				{currentUser?.display_name}
			</span>
			<motion.span
				className={styles.icon2}
				style={
					topbarModalState
						? { rotate: 0, transformOrigin: '29%' }
						: { rotate: 180, transformOrigin: '29%' }
				}
			>
				{icon2}
			</motion.span>
		</motion.button>
	);
};

export default motion(forwardRef(ProfileButton));
