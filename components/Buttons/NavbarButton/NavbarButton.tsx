import React, { FC, ReactNode } from 'react';
import cn from 'classnames';
import styles from './NavbarButton.module.scss';
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion';

interface NavbarButtonProps extends HTMLMotionProps<'button'> {
	ariaLabel: string;
	content: string;
	icon: ReactNode;
}

const hoverVariants: Variants = {
	hover: {
		color: 'var(--text-hover)',
		transition: { duration: 0 },
	},
	rest: {
		color: 'var(--text-base)',
		transition: { duration: 0 },
	},
	active: {
		color: 'var(--text-hover)',
		transition: { duration: 0 },
	},
};

const NavbarButton: FC<NavbarButtonProps> = ({
	ariaLabel,
	icon,
	content,
	className,
	...props
}) => {
	const contrls = useAnimation();
	return (
		<motion.button
			aria-label={ariaLabel}
			className={cn(className, styles.navbarButton)}
			initial='rest'
			variants={hoverVariants}
			animate={contrls}
			onHoverStart={() => contrls.start('hover')}
			onHoverEnd={() => contrls.start('rest')}
			{...props}
		>
			<span className={styles.icon}>{icon}</span>
			<span className={styles.textContent}>{content}</span>
		</motion.button>
	);
};

export default React.memo(NavbarButton);
