import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	ReactNode,
} from 'react';
import cn from 'classnames';
import styles from './ModalLayout.module.scss';

interface ModalLayoutProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children: ReactNode;
}

const ModalLayout = (
	{ children, className, ...props }: ModalLayoutProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	return (
		<div className={cn(className, styles.modalLayout)} {...props} ref={ref}>
			<div className={styles.menu}>
				<div className={styles.content}>
					<div className={styles.linksList}>{children}</div>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(ModalLayout);
