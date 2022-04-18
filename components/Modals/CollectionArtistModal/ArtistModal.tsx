import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
} from 'react';
import cn from 'classnames';
import styles from './ArtistModal.module.scss';
import { useTranslation } from 'next-i18next';
import NavbarModalButton from '../../Buttons/NavbarModalButton/NavbarModalButton';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

interface ArtistModal
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	fetching: boolean;
	inLibrary: boolean;
	toRadio: (a: string) => void;
	followArtist: (a: string) => void;
	unFollowArtist: (a: string) => void;
}

const ArtistModal = (
	{
		fetching,
		inLibrary,
		className,
		toRadio,
		followArtist,
		unFollowArtist,
		...props
	}: ArtistModal,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');
	const { collectionArtistState } = useTypedSelector((state) => state.client);

	return (
		<div className={cn(className, styles.artistModal)} {...props} ref={ref}>
			<div className={styles.menu}>
				<div className={styles.content}>
					<ul className={styles.linksList}>
						{inLibrary ? (
							<NavbarModalButton
								ariaLabel={t(
									'collection.artists.modal.unFollowArtistAria'
								)}
								content={t(
									'collection.artists.modal.unFollowArtistText'
								)}
								fetching={fetching}
								onClick={() =>
									unFollowArtist(
										collectionArtistState.artistId
									)
								}
							/>
						) : (
							<NavbarModalButton
								ariaLabel={t(
									'collection.artists.modal.unFollowArtistAria'
								)}
								content={t(
									'collection.artists.modal.unFollowArtistText'
								)}
								fetching={fetching}
								onClick={() =>
									followArtist(collectionArtistState.artistId)
								}
							/>
						)}
						<NavbarModalButton
							ariaLabel={t(
								'collection.artists.modal.toRadioAria'
							)}
							content={t('collection.artists.modal.toRadioText')}
							fetching={fetching}
						/>

						<NavbarModalButton
							ariaLabel={t('collection.artists.modal.shareAria')}
							content={t('collection.artists.modal.shareText')}
							fetching={fetching}
						/>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(ArtistModal);
