import React, { ForwardedRef, forwardRef } from 'react';
import cn from 'classnames';
import styles from './NavbarPlaylistItem.module.scss';
import { HTMLMotionProps, motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

interface NavbarPlaylistItemProps extends HTMLMotionProps<'li'> {
	name: string;
	href: string;
	ariaLabel: string;
	playlistId: string;
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

const NavbarPlaylistItem = (
	{
		name,
		playlistId,
		ariaLabel,
		href,
		className,
		...props
	}: NavbarPlaylistItemProps,
	ref: ForwardedRef<HTMLAnchorElement | null>
): JSX.Element => {
	const { selectedPlaylist } = useTypedSelector((state) => state.server);
	return (
		<motion.li className={cn(className, styles.playlistItem)} {...props}>
			<div className={styles.container}>
				<Link href={`/playlist/${href}`} passHref scroll>
					<motion.a
						aria-label={`${ariaLabel} ${name}`}
						variants={hoverVariants}
						className={styles.playListLink}
						whileHover='hover'
						initial='rest'
						animate={
							selectedPlaylist?.id === playlistId
								? 'active'
								: 'rest'
						}
						ref={ref}
						id={playlistId}
					>
						<span className={styles.text}>{name}</span>
					</motion.a>
				</Link>
			</div>
		</motion.li>
	);
};

export default React.memo(motion(forwardRef(NavbarPlaylistItem)));
