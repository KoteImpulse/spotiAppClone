import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './Playerbar.module.scss';

interface PlayerbarProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Playerbar: FC<PlayerbarProps> = ({ className, ...props }) => {
	return (
		<div className={cn(className, styles.playerbar)} {...props}>
			<div className={styles.playerContainer}>Player</div>
		</div>
	);
};

export default React.memo(Playerbar);
