import React, { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import styles from './MainviewLayout.module.scss';

interface MainviewLayoutProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children: ReactNode;
}

const MainviewLayout: FC<MainviewLayoutProps> = ({
	className,
	children,
	...props
}) => {
	return (
		<div className={cn(className, styles.mainviewLayout)} {...props}>
			<div className={styles.container}>
				<div className={styles.stickyTop}></div>
				<main className={styles.mainContent}>{children}</main>
			</div>
		</div>
	);
};

export default MainviewLayout;
