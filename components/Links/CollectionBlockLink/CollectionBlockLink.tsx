import React, { FC } from 'react';
import cn from 'classnames';
import styles from './CollectionBlockLink.module.scss';
import Link from 'next/link';
import {
	AnimatePresence,
	HTMLMotionProps,
	motion,
	Variants,
} from 'framer-motion';
import { useRouter } from 'next/router';

interface CollectionBlockLinkProps extends HTMLMotionProps<'li'> {
	ariaLabel: string;
	href: string;
	content: string;
}

const hoverVariants: Variants = {
	rest: {
		backgroundColor: 'var(--background-top-nav-button)',
		transition: { duration: 0, ease: 'linear' },
	},
	active: {
		backgroundColor: 'var(--background-top-nav-button-active)',
		transition: { duration: 0, ease: 'linear' },
	},
};

const CollectionBlockLink: FC<CollectionBlockLinkProps> = ({
	ariaLabel,
	href,
	content,
	className,
	...props
}) => {
	const { asPath } = useRouter();
	return (
		<AnimatePresence initial={false}>
			<motion.li
				className={cn(className, styles.collectionBlockLink)}
				{...props}
			>
				<Link href={href} passHref scroll>
					<motion.a
						aria-label={ariaLabel}
						className={styles.link}
						initial={false}
						variants={hoverVariants}
						animate={href === asPath ? 'active' : 'rest'}
						style={
							href === asPath
								? {
										pointerEvents: 'none',
								  }
								: {}
						}
					>
						<span className={styles.contentText}>{content}</span>
					</motion.a>
				</Link>
			</motion.li>
		</AnimatePresence>
	);
};

export default CollectionBlockLink;
