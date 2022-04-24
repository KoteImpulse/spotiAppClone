import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './Main.module.scss';
import PlaylistsSection from '../Sections/PlaylistsSection/PlaylistsSection';
import { useTranslation } from 'next-i18next';
import AlbumsSection from '../Sections/AlbumsSection/AlbumsSection';
import { Playlist } from '../../../types/playlist';
import ArtistsSection from '../Sections/ArtistsSection/ArtistsSection';

interface MainProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	playlists: any;
	category: any;
	featuredPlaylists: any;
	newReleases: any;
	releasRadar: any;
	discoverWeekly: any;
	topArtists: any;
}

const Main: FC<MainProps> = ({
	featuredPlaylists,
	newReleases,
	discoverWeekly,
	releasRadar,
	category,
	playlists,
	topArtists,
	className,
	...props
}) => {
	const { t } = useTranslation('mainview');
	return (
		<section className={cn(className, styles.main)} {...props}>
			<div className={styles.container}>
				<div className={styles.sectionsBlock}>
					{topArtists?.items?.length > 0 && (
						<ArtistsSection
							artistsArray={topArtists.items}
							usage='mainPage'
							headerText={t('mainPage.topArtists')}
						/>
					)}
					{releasRadar?.playlists?.items.length > 0 &&
						discoverWeekly.playlists.items.length > 0 && (
							<PlaylistsSection
								playlistsArray={[
									releasRadar.playlists.items[0],
									discoverWeekly.playlists.items[0],
								]}
								headerText={t('mainPage.realeaseRadar')}
								usage='mainPage'
							/>
						)}
					{newReleases?.albums?.items.length > 0 && (
						<AlbumsSection
							albumsArray={newReleases.albums.items}
							headerText={t('mainPage.newReleases')}
							usage='mainPage'
						/>
					)}
					{featuredPlaylists?.playlists?.items.length > 0 && (
						<PlaylistsSection
							playlistsArray={featuredPlaylists.playlists.items}
							headerText={t('mainPage.featuredPlaylists')}
							usage='mainPage'
						/>
					)}
					{playlists?.playlists?.items.length > 0 &&
						playlists.map((item: any, i: number) => {
							return (
								<PlaylistsSection
									key={item.playlists.href}
									playlistsArray={item.playlists.items}
									headerText={category[i].name}
									usage='mainPage'
								/>
							);
						})}
				</div>
			</div>
		</section>
	);
};

export default Main;
