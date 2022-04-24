import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './SearchComp.module.scss';
import PlaylistsSection from '../Sections/PlaylistsSection/PlaylistsSection';
import { useTranslation } from 'next-i18next';
import AlbumsSection from '../Sections/AlbumsSection/AlbumsSection';
import ArtistsSection from '../Sections/ArtistsSection/ArtistsSection';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import SongsSection from '../Sections/SongsSection/SongsSection';

interface SearchCompProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const SearchComp: FC<SearchCompProps> = ({ className, ...props }) => {
	const { t } = useTranslation('mainview');
	const { searchResults } = useTypedSelector((state) => state.client);
	console.log(searchResults);
	return (
		<section className={cn(className, styles.search)} {...props}>
			<div className={styles.container}>
				<div className={styles.sectionsBlock}>
					<h1 className={styles.searchHeader}>{t('searchPage.results')}</h1>
					{searchResults && (
						<>
							{searchResults?.artists?.items.length > 0 && (
								<ArtistsSection
									usage='mainPage'
									artistsArray={searchResults.artists.items}
									headerText={t('searchPage.artists')}
								/>
							)}
							{/* {searchResults?.tracks?.items.length > 0 && (
								<SongsSection
									
									// songsArray={searchResults?.tracks?.items}
									// headerText={t('searchPage.artists')}
								/>
							)} */}
							{searchResults?.playlists?.items.length > 0 && (
								<PlaylistsSection
									usage='mainPage'
									playlistsArray={
										searchResults.playlists.items
									}
									headerText={t('searchPage.playlists')}
								/>
							)}
							{searchResults?.albums?.items.length > 0 && (
								<AlbumsSection
									usage={'mainPage'}
									albumsArray={searchResults.albums.items}
									headerText={t('searchPage.albums')}
								/>
							)}
						</>
					)}
				</div>
			</div>
		</section>
	);
};

export default SearchComp;
