import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import cn from 'classnames';
import styles from './HeaderHistoryButton.module.scss';
import { IoArrowUndoOutline, IoArrowRedoOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';

interface HeaderHistoryButtonProps
	extends DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	side: 'left' | 'right' | 'none';
	ariaLabel: string;
}

const HeaderHistoryButton: FC<HeaderHistoryButtonProps> = ({
	className,
	ariaLabel,
	side,
	...props
}) => {
	const { locale } = useRouter();
	const a = {
		left: <IoArrowUndoOutline />,
		right: <IoArrowRedoOutline />,
		none: `${locale === 'ru' ? 'EN' : 'RU'}`,
	};
	return (
		<button
			aria-label={ariaLabel}
			className={cn(className, styles.headerHistoryButton)}
			{...props}
		>
			<span className={styles.icon}>{a[side]}</span>
		</button>
	);
};

export default HeaderHistoryButton;
