import React, { FC, ReactNode } from 'react';
import cn from 'classnames';
import styles from './NavbarLink.module.scss';
import {
	AnimatePresence,
	HTMLMotionProps,
	motion,
	Variants,
} from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavbarLinkProps extends HTMLMotionProps<'li'> {
	ariaLabel: string;
	href: string;
	content: string;
	icon: ReactNode;
}

interface ILinkObject {
	[index: string]: boolean;
}

const hoverVariants: Variants = {
	hover: {
		color: 'var(--text-hover)',
		transition: { duration: 0.2, ease: 'linear' },
	},
	rest: {
		color: 'var(--text-base)',
		transition: { duration: 0, ease: 'linear' },
	},
	active: {
		color: 'var(--text-hover)',
		transition: { duration: 0, ease: 'linear' },
	},
};

const NavbarLink: FC<NavbarLinkProps> = ({
	ariaLabel,
	icon,
	href,
	content,
	className,
	...props
}) => {
	const { asPath } = useRouter();

	const activeButton: ILinkObject = {
		'/collection/playlists': true,
		'/collection/albums': true,
		'/collection/artists': true,
	};
	return (
			<motion.li className={cn(className, styles.listItem)} {...props}>
				<Link href={href} passHref scroll>
					<motion.a
						aria-label={ariaLabel}
						className={cn(className, styles.navbarLink)}
						whileHover='hover'
						initial='rest'
						variants={hoverVariants}
						animate={
							href === asPath ||
							(href === '/collection/playlists' &&
								activeButton[asPath])
								? 'active'
								: 'rest'
						}
						style={
							href === asPath
								? {
										pointerEvents: 'none',
								  }
								: {}
						}
					>
						<span className={styles.icon}>{icon}</span>
						<span className={styles.textContent}>{content}</span>
					</motion.a>
				</Link>
			</motion.li>
	);
};

export default React.memo(NavbarLink);
