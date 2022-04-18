import React, { FC } from 'react';
import cn from 'classnames';
import styles from './LoginLink.module.scss';
import Link from 'next/link';
import { HTMLMotionProps, motion, Variants } from 'framer-motion';

interface LoginLinkProps extends HTMLMotionProps<'a'> {
	ariaLabel: string;
	href?: string;
	content?: string;
}

const hoverVariants: Variants = {
	initial: { scale: 1 },
	hover: {
		scale: 1.08,
		transition: {
			ease: 'easeOut',
			duration: 0.1,
		},
	},
};

const LoginLink: FC<LoginLinkProps> = ({
	ariaLabel,
	content,
	href,
	className,
	...props
}) => {
	return (
		<>
			{href ? (
				<Link href={href} passHref>
					<motion.a
						aria-label={ariaLabel}
						className={cn(className, styles.loginLink)}
						{...props}
						whileHover='hover'
						initial='initial'
						variants={hoverVariants}
					>
						<span className={styles.textContent}>{content}</span>
					</motion.a>
				</Link>
			) : (
				<motion.a
					aria-label={ariaLabel}
					className={cn(className, styles.loginLink)}
					{...props}
					whileHover='hover'
					initial='initial'
					variants={hoverVariants}
				>
					<span className={styles.textContent}>{content}</span>
				</motion.a>
			)}
		</>
	);
};

export default LoginLink;
