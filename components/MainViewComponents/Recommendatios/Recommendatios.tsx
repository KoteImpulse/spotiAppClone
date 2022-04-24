import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './Recommendatios.module.scss';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import PlaylistPlayButton from '../../Buttons/PlaylistPlayButton/PlaylistPlayButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import RecommendatiosSection from '../Sections/RecommendatiosSection/RecommendatiosSection';

interface RecommendatiosProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Recommendatios: FC<RecommendatiosProps> = ({ className, ...props }) => {
	const { t } = useTranslation('mainview');
	const { songs } = useTypedSelector((state) => state.server);
	const { data: session } = useSession();

	const [fetching, setFetching] = useState<boolean>(false);
	const router = useRouter();
	useEffect(() => {}, [songs.songsArray]);

	return (
		<section className={cn(className, styles.recommendatios)} {...props}>
			<div className={styles.titleHalf}>
				<div className={styles.pictureBlock}>
					<div className={styles.imageContainer}>
						<Image
							src={'/liked.png'}
							className={styles.nextImage}
							alt={'no image'}
							width={231}
							height={231}
							quality={40}
						/>
					</div>
				</div>
				<div className={styles.textBlock}>
					<h2 className={styles.type}>
						{t('recommendationPage.playlist')}
					</h2>
					<span className={styles.name}>
						<h1 className={styles.headerText}>
							{t('recommendationPage.recommendation')}
						</h1>
					</span>
					<div className={styles.statsBlock}>
						<span className={styles.owner}>
							<span className={styles.ownerText}>
								{session?.user.name}
							</span>
						</span>
						{songs.total > 0 && (
							<span className={styles.likes}>
								{`${songs.total} ${t(
									'recommendationPage.songsNumber'
								)}`}
							</span>
						)}
					</div>
				</div>
			</div>
			<div className={styles.songsHalf}>
				<div className={styles.playlistButtons}>
					{songs.songsArray.length > 0 && (
						<PlaylistPlayButton
							ariaLabel={t('recommendationPage.playAria')}
							size={54}
							fetching={fetching}
						/>
					)}
				</div>
				<div className={styles.songsContainer}>
					<RecommendatiosSection />
				</div>
			</div>
		</section>
	);
};

export default Recommendatios;
