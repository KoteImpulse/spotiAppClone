import React, { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import styles from './TopbarCenterBlock.module.scss';
import { useRouter } from 'next/router';
import PlaylistBlock from '../TopbarContent/PlaylistBlock/PlaylistBlock';
import SearchBlock from '../TopbarContent/SearchBlock/SearchBlock';
import CollectionBlock from '../TopbarContent/CollectionBlock/CollectionBlock';
import TracksBlock from '../TopbarContent/TracksBlock/TracksBlock';

interface TopbarCenterBlockProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

interface ILinkObject {
	[index: string]: ReactNode;
}

const TopbarCenterBlock: FC<TopbarCenterBlockProps> = ({
	className,
	...props
}) => {
	const router = useRouter();
	const type = router.asPath !== '/' ? router.asPath.split('/')[1] : 'main';

	const renderVariants: ILinkObject = {
		playlist: <PlaylistBlock />,
		search: <SearchBlock />,
		main: null,
		collection: <CollectionBlock />,
		tracks: <TracksBlock />,
	};
	return (
		<div
			className={cn(className, styles.topbarCenterBlock)}
			{...props}
			style={
				router.asPath === '/collection/playlists'
					? { overflow: 'unset' }
					: { overflow: 'hidden' }
			}
		>
			<div
				className={styles.content}
				style={
					router.asPath === '/collection/playlists'
						? { overflow: 'unset' }
						: { overflow: 'hidden' }
				}
			>
				{renderVariants[type]}
			</div>
		</div>
	);
};

export default TopbarCenterBlock;
