import React, { FC } from 'react';
import cn from 'classnames';
import styles from './TopbarModalLink.module.scss';
import { HTMLMotionProps, motion, Variants } from 'framer-motion';
import Link from 'next/link';

interface TopbarModalLinkProps extends HTMLMotionProps<'div'> {
	ariaLabel: string;
	href: string;
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

const TopbarModalLink: FC<TopbarModalLinkProps> = ({
	ariaLabel,
	href,
	content,
	className,
	...props
}) => {
	return (
		<motion.div
			className={cn(className, styles.topbarModalLink)}
			{...props}
		>
			<Link href={href} passHref>
				<motion.a
					aria-label={ariaLabel}
					className={styles.link}
					whileHover='hover'
					initial='rest'
					variants={hoverVariants}
				>
					<span className={styles.textContent}>{content}</span>
				</motion.a>
			</Link>
		</motion.div>
	);
};

export default TopbarModalLink;
