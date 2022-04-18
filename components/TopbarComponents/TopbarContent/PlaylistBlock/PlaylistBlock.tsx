import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import styles from './PlaylistBlock.module.scss';
import { useTranslation } from 'next-i18next';
import HeaderPlayButton from '../../../Buttons/HeaderPlayButton/HeaderPlayButton';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

interface PlaylistBlockProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const PlaylistBlock: FC<PlaylistBlockProps> = () => {
	const { t } = useTranslation('topbar');
	const { selectedPlaylist } = useTypedSelector((state) => state.server);

	return (
		<>
			{/* <HeaderPlayButton ariaLabel={t('content.playlistBlock.playAria')} /> */}
			<span className={styles.contentTitle}>
				<span className={styles.text}>
					{selectedPlaylist.name || ''}
				</span>
			</span>
		</>
	);
};

export default PlaylistBlock;
