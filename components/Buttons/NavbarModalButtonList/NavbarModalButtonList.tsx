import React, { FC, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import styles from './NavbarModalButtonList.module.scss';
import {
	AnimatePresence,
	HTMLMotionProps,
	motion,
	useAnimation,
	Variants,
} from 'framer-motion';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Playlist } from '../../../types/playlist';
import NavbarModalButtonListItem from '../NavbarModalButtonListItem/NavbarModalButtonListItem';

interface NavbarModalButtonListProps extends HTMLMotionProps<'li'> {
	ariaLabel: string;
	content: string;
	addToPlaylist: (a: string, b: string) => void;
	parent: any;
	usage: 'playlistSong' | 'collectionAlbum';
	fetching?: boolean;
	sublistItems?: boolean;
	array?: boolean;
	arrayItems?: any[];
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

const NavbarModalButtonList: FC<NavbarModalButtonListProps> = ({
	ariaLabel,
	parent,
	usage,
	addToPlaylist,
	arrayItems,
	array,
	fetching,
	content,
	className,
	...props
}) => {
	const { userPlaylists, currentUser } = useTypedSelector(
		(state) => state.server
	);
	const [hover, setHover] = useState<boolean>(false);
	const [transX, setTransX] = useState<number>(0);
	const [transY, setTransY] = useState<number>(0);
	const ref = useRef<HTMLDivElement>(null);
	const contrls = useAnimation();

	useEffect(() => {
		if (!ref) return;
		let subMenuHeight = ref?.current?.getBoundingClientRect().height;
		let subMenuWidth = ref?.current?.getBoundingClientRect().width;
		let width = window.innerWidth;
		let height = window.innerHeight;

		if (subMenuWidth) {
			if (parent.x + parent.width + subMenuWidth > width) {
				setTransX(-subMenuWidth + 20);
			} else {
				setTransX(parent.width - 20);
			}
		}
		if (subMenuHeight) {
			if (parent.y + parent.height + subMenuHeight > height) {
				const y = usage === 'collectionAlbum' ? 30 : -130;
				setTransY(
					-subMenuHeight +
						width -
						parent.y +
						parent.height -
						subMenuHeight +
						y
				);
			} else {
				setTransY(-40);
			}
		}
	}, [
		ref,
		hover,
		transX,
		transY,
		parent.x,
		parent.width,
		parent.y,
		parent.height,
	]);

	return (
		<motion.li
			className={cn(className, styles.navbarModalButtonList)}
			onHoverStart={() => setHover(true)}
			onHoverEnd={() => setHover(false)}
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
			{hover &&
				(array ? (
					<AnimatePresence>
						<motion.div
							className={styles.secondContainer}
							ref={ref}
							style={{
								transform: `translate(${transX}px,${transY}px)`,
							}}
						>
							<motion.ul className={styles.secondListItems}>
								{userPlaylists
									.filter(
										(item: Playlist) =>
											item.owner.id === currentUser.id &&
											item
									)
									.map((item: Playlist) => {
										return (
											<li
												key={item.id}
												className={
													styles.secondListItem
												}
											>
												<NavbarModalButtonListItem
													item={item}
													ariaLabel={ariaLabel}
													addToPlaylist={
														addToPlaylist
													}
												/>
											</li>
										);
									})}
							</motion.ul>
						</motion.div>
					</AnimatePresence>
				) : (
					<motion.div
						className={styles.secondContainer}
						ref={ref}
						style={{
							transform: `translate(${transX}px,${transY}px)`,
						}}
					>
						<ul className={styles.secondListItems}>
							{arrayItems?.map((item: Playlist, index) => (
								<li
									key={index}
									className={styles.secondListItem}
								>
									<li
										key={item.id}
										className={styles.secondListItem}
									>
										<NavbarModalButtonListItem
											item={item}
											ariaLabel={ariaLabel}
											addToPlaylist={addToPlaylist}
										/>
									</li>
								</li>
							))}
						</ul>
					</motion.div>
				))}
		</motion.li>
	);
};

export default React.memo(NavbarModalButtonList);
