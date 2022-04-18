import React, { FC, ForwardedRef, forwardRef } from 'react';
import cn from 'classnames';
import styles from './OtherVariantsButton.module.scss';
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

interface OtherVariantsButtonProps extends HTMLMotionProps<'button'> {
	ariaLabel: string;
	usage: 'playlist' | 'song' | 'album';
	fetching: boolean;
	isOpened: boolean;
	content?: string;
}

const OtherVariantsButton = (
	{
		ariaLabel,
		isOpened,
		id,
		usage,
		content,
		className,
		fetching,
		...props
	}: OtherVariantsButtonProps,
	ref: ForwardedRef<HTMLButtonElement>
): JSX.Element => {
	const { selectedPlaylist } = useTypedSelector((state) => state.server);

	const clickHandler = () => {
		console.log('dsa');
	};
	return (
		<motion.button
			aria-label={ariaLabel}
			className={cn(className, styles.otherVariantsButton)}
			onClick={() => clickHandler()}
			disabled={fetching}
			style={fetching ? { cursor: 'not-allowed' } : { cursor: 'default' }}
			ref={ref}
			{...props}
		>
			<div className={styles.innerButton}>
				<span className={styles.icon}>
					<IoEllipsisHorizontal />
				</span>
				{content && (
					<span className={styles.textContent}>{content}</span>
				)}
			</div>
		</motion.button>
	);
};

export default forwardRef(OtherVariantsButton);
