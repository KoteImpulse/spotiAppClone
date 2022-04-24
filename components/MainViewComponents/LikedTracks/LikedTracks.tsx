import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './LikedTracks.module.scss';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import PlaylistPlayButton from '../../Buttons/PlaylistPlayButton/PlaylistPlayButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LikedTracksSection from '../Sections/LikedTracksSection/LikedTracksSection';

interface LikedTracksProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
}

const LikedTracks: FC<LikedTracksProps> = ({ className, ...props }) => {
	const { t } = useTranslation('mainview');
	const { likedTracks } = useTypedSelector((state) => state.server);
	const { data: session } = useSession();

	const [fetching, setFetching] = useState<boolean>(false);
	const router = useRouter();
	useEffect(() => {}, [likedTracks.songsArray]);

	return (
		<section className={cn(className, styles.likedTracks)} {...props}>
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
						{t('likedTracksPage.playlist')}
					</h2>
					<span className={styles.name}>
						<h1 className={styles.headerText}>
							{t('likedTracksPage.likedSongs')}
						</h1>
					</span>
					<div className={styles.statsBlock}>
						<span className={styles.owner}>
							<span className={styles.ownerText}>
								{session?.user.name}
							</span>
						</span>
						{likedTracks.total > 0 && (
							<span className={styles.likes}>
								{`${likedTracks.total} ${t('playlistPage.tracks')}`}
							</span>
						)}
					</div>
				</div>
			</div>
			<div className={styles.songsHalf}>
				<div className={styles.playlistButtons}>
					{likedTracks.songsArray.length > 0 && (
						<PlaylistPlayButton
							ariaLabel={t('likedTracksPage.playAria')}
							size={54}
							fetching={fetching}
						/>
					)}
				</div>
				<div className={styles.songsContainer}>
					<LikedTracksSection />
				</div>
			</div>
		</section>
	);
};

export default LikedTracks;
