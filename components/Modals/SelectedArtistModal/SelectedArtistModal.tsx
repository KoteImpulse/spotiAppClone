import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
} from 'react';
import cn from 'classnames';
import styles from './SelectedArtistModal.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarModalButton from '../../Buttons/NavbarModalButton/NavbarModalButton';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { shareHandler } from '../../../lib/helper';
import { useRouter } from 'next/router';

interface SelectedArtistModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	fetching: boolean;
	inLibrary: boolean;
	deleteArtistFromLibrary: (a: string) => void;
	addArtistToLibrary: (a: string) => void;
	setFetching: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectedArtistModal = (
	{
		fetching,
		setFetching,
		inLibrary,
		deleteArtistFromLibrary,
		addArtistToLibrary,
		className,
		...props
	}: SelectedArtistModalProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');
	const { selectedArtist } = useTypedSelector((state) => state.server);
	const router = useRouter();

	const toRecommendation = () => {
		const a = selectedArtist.id;
		router.push({
			pathname: '/recommendation/',
			query: { artist: a },
		});
	};

	return (
		<div
			className={cn(className, styles.selectedArtistModal)}
			{...props}
			ref={ref}
		>
			<div className={styles.menu}>
				<div className={styles.content}>
					<ul className={styles.linksList}>
						{inLibrary ? (
							<NavbarModalButton
								ariaLabel={t(
									'artistPage.artistModal.deleteArtistAria'
								)}
								content={t(
									'artistPage.artistModal.deleteArtistText'
								)}
								onClick={() =>
									deleteArtistFromLibrary(selectedArtist.id)
								}
								fetching={fetching}
							/>
						) : (
							<NavbarModalButton
								ariaLabel={t(
									'artistPage.artistModal.addArtistAria'
								)}
								content={t(
									'artistPage.artistModal.addArtistText'
								)}
								onClick={() =>
									addArtistToLibrary(selectedArtist.id)
								}
								fetching={fetching}
							/>
						)}
						<NavbarModalButton
							ariaLabel={t('artistPage.artistModal.toRadioAria')}
							content={t('artistPage.artistModal.toRadioText')}
							fetching={fetching}
							onClick={() => toRecommendation()}
						/>
						<NavbarModalButton
							ariaLabel={t(
								'playlistPage.playlistModal.shareAria'
							)}
							content={t('playlistPage.playlistModal.shareText')}
							fetching={fetching}
							onClick={() =>
								shareHandler(
									'selectedArtist',
									selectedArtist.id
								)
							}
						/>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(SelectedArtistModal);
