import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	ReactNode,
	useEffect,
	useRef,
} from 'react';
import cn from 'classnames';
import styles from './MainviewLayout.module.scss';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';

interface MainviewLayoutProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children: ReactNode;
	array?: any[];
	total?: number;
}

const MainviewLayout: FC<MainviewLayoutProps> = ({
	className,
	array,
	total,
	children,
	...props
}) => {
	const { shouldLoading } = useTypedSelector((state) => state.client);
	const { setLoadingContent } = useActions();
	const refContainer = useRef<HTMLDivElement>(null);

	// useEffect(() => {
	// 	if (
	// 		refContainer &&
	// 		total &&
	// 		array &&
	// 		refContainer?.current &&
	// 		refContainer?.current?.scrollHeight ===
	// 			refContainer?.current?.clientHeight &&
	// 		refContainer?.current?.scrollTop === 0 &&
	// 		total - array.length > 0
	// 	) {
	// 		setLoadingContent(true);
	// 	}
	// }, [array, setLoadingContent, total]);

	useEffect(() => {
		const reefrence = refContainer.current;

		function handleScroll(e: any) {
			if (
				total &&
				array &&
				refContainer?.current &&
				refContainer?.current?.scrollHeight -
					(refContainer?.current?.scrollTop +
						refContainer?.current?.clientHeight) <
					300 &&
				total - array.length > 0
			) {
				setLoadingContent(true);
			}
		}
		reefrence?.addEventListener('scroll', handleScroll);
		return () => {
			reefrence?.removeEventListener('scroll', handleScroll);
		};
	}, [array, setLoadingContent, total]);

	return (
		<div className={cn(className, styles.mainviewLayout)} {...props}>
			<div className={styles.container} ref={refContainer}>
				<div className={styles.stickyTop}></div>
				<main className={styles.mainContent}>{children}</main>
			</div>
		</div>
	);
};

export default MainviewLayout;
