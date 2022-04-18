import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import styles from './TracksBlock.module.scss';
import { useTranslation } from 'next-i18next';
import HeaderPlayButton from '../../../Buttons/HeaderPlayButton/HeaderPlayButton';
import { IoPlay } from 'react-icons/io5';

interface TracksBlockProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const TracksBlock: FC<TracksBlockProps> = () => {
	const { t } = useTranslation('topbar');
	return (
		<>
			<HeaderPlayButton
				ariaLabel={t('content.tracksBlock.tracksAria')}
				onClick={() => {
					return;
				}}
			/>
			<span className={styles.contentTitle}>
				{t('content.tracksBlock.tracksText')}
			</span>
		</>
	);
};

export default TracksBlock;
