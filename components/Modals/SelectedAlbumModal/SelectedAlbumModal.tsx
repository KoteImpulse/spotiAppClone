import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
} from 'react';
import cn from 'classnames';
import styles from './SelectedAlbumModal.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarModalButton from '../../Buttons/NavbarModalButton/NavbarModalButton';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import NavbarModalButtonList from '../../Buttons/NavbarModalButtonList/NavbarModalButtonList';
import { shareHandler } from '../../../lib/helper';
import { useRouter } from 'next/router';
import { Artist } from '../../../types/artist';

interface SelectedAlbumModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	fetching: boolean;
	inLibrary: boolean;
	deleteAlbumFromLibrary: (a: string) => void;
	addAlbumToLibrary: (a: string) => void;
	addToPlaylist: (a: string) => void;
	addQueue: (a: string) => void;
	setFetching: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectedAlbumModal = (
	{
		fetching,setFetching,
		inLibrary,
		deleteAlbumFromLibrary,
		addAlbumToLibrary,
		addToPlaylist,
		addQueue,
		className,
		...props
	}: SelectedAlbumModalProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');
	const { selectedAlbum } = useTypedSelector((state) => state.server);
	const router = useRouter();

	const toRecommendation = () => {
		const a = selectedAlbum.artists
			.map((item: Artist) => item.id)
			.slice(0, 4)
			.join(',');

		router.push({
			pathname: '/recommendation/',
			query: { artist: a },
		});
	};

	return (
		<div
			className={cn(className, styles.selectedAlbumModal)}
			{...props}
			ref={ref}
		>
			<div className={styles.menu}>
				<div className={styles.content}>
					<ul className={styles.linksList}>
						{inLibrary ? (
							<NavbarModalButton
								ariaLabel={t(
									'albumPage.albumModal.deleteAlbumAria'
								)}
								content={t(
									'albumPage.albumModal.deleteAlbumText'
								)}
								onClick={() =>
									deleteAlbumFromLibrary(selectedAlbum.id)
								}
								fetching={fetching}
							/>
						) : (
							<NavbarModalButton
								ariaLabel={t(
									'albumPage.albumModal.addAlbumAria'
								)}
								content={t('albumPage.albumModal.addAlbumText')}
								onClick={() =>
									addAlbumToLibrary(selectedAlbum.id)
								}
								fetching={fetching}
							/>
						)}
						<NavbarModalButton
							ariaLabel={t('albumPage.albumModal.addQueueAria')}
							content={t('albumPage.albumModal.addQueueText')}
							fetching={fetching}
						/>
						<NavbarModalButton
							ariaLabel={t('albumPage.albumModal.toRadioAria')}
							content={t('albumPage.albumModal.toRadioText')}
							fetching={fetching}
							onClick={() => toRecommendation()}
						/>
						<NavbarModalButtonList
							ariaLabel={t(
								'albumPage.albumModal.addToPlaylistAria'
							)}
							content={t(
								'albumPage.albumModal.addToPlaylistText'
							)}
							fetching={fetching}
							array
							addToPlaylist={addToPlaylist}
							usage='selectedAlbum'
						/>
						<NavbarModalButton
							ariaLabel={t(
								'playlistPage.playlistModal.shareAria'
							)}
							content={t('playlistPage.playlistModal.shareText')}
							fetching={fetching}
							onClick={() =>
								shareHandler('selectedAlbum', selectedAlbum.id)
							}
						/>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(SelectedAlbumModal);
