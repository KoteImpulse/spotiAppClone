import React, { FC } from 'react';
import cn from 'classnames';
import styles from './NavbarModalButton.module.scss';
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion';

interface NavbarModalButtonProps extends HTMLMotionProps<'li'> {
	ariaLabel: string;
	content: string;
	fetching?: boolean;
}

const hoverVariants: Variants = {
	hover: {
		backgroundColor: 'var(--background-navbar-modal-hover)',
		color: 'var(--text-hover)',
		transition: { duration: 0 },
	},
	rest: {
		backgroundColor: 'var(--background-navbar-modal)',
		color: 'var(--text-base)',
		transition: { duration: 0 },
	},
	active: {
		backgroundColor: 'var(--background-navbar-modal-hover)',
		color: 'var(--text-hover)',
		transition: { duration: 0 },
	},
};

const NavbarModalButton: FC<NavbarModalButtonProps> = ({
	ariaLabel,
	fetching,
	content,
	className,
	...props
}) => {
	const contrls = useAnimation();

	return (
		<motion.li
			className={cn(className, styles.navbarModalButton)}
			{...props}
		>
			<motion.button
				className={styles.button}
				aria-label={ariaLabel}
				initial='rest'
				variants={hoverVariants}
				disabled={fetching}
				style={
					fetching ? { cursor: 'not-allowed' } : { cursor: 'default' }
				}
				animate={contrls}
				onHoverStart={() => contrls.start('hover')}
				onHoverEnd={() => contrls.start('rest')}
			>
				<span className={styles.textContent}>{content}</span>
			</motion.button>
		</motion.li>
	);
};

export default React.memo(NavbarModalButton);
