import React, { FC } from 'react';
import styles from './NavbarModalButtonListItem.module.scss';
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Playlist } from '../../../types/playlist';

interface NavbarModalButtonListItemProps extends HTMLMotionProps<'button'> {
	ariaLabel: string;
	item: Playlist;
	addToPlaylist: (a: string, b: string) => void;
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
};

const NavbarModalButtonListItem: FC<NavbarModalButtonListItemProps> = ({
	ariaLabel,
	item,
	addToPlaylist,
	fetching,
	className,
	...props
}) => {
	const { collectionAlbumState: parent } = useTypedSelector(
		(state) => state.client
	);
	const contrls = useAnimation();

	return (
		<motion.button
			className={styles.secondButton}
			aria-label={`${ariaLabel} - ${item.name}`}
			initial={'rest'}
			variants={hoverVariants}
			disabled={fetching}
			style={
				fetching
					? {
							cursor: 'not-allowed',
					  }
					: {
							cursor: 'default',
					  }
			}
			onClick={() => addToPlaylist(item.id, parent.albumId)}
			animate={contrls}
			onHoverStart={() => contrls.start('hover')}
			onHoverEnd={() => contrls.start('rest')}
			{...props}
		>
			<span className={styles.secondTextContent}>{item.name}</span>
		</motion.button>
	);
};

export default React.memo(NavbarModalButtonListItem);
