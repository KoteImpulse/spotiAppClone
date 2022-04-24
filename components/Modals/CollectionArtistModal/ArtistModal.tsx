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
import { modalClose, shareHandler } from '../../../lib/helper';
import { useActions } from '../../../hooks/useActions';
import { useRouter } from 'next/router';

interface ArtistModal
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	fetching: boolean;
	inLibrary: boolean;
	followArtist: (a: string) => void;
	unFollowArtist: (a: string) => void;
	setFetching: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArtistModal = (
	{
		fetching,
		setFetching,
		inLibrary,
		className,
		followArtist,
		unFollowArtist,
		...props
	}: ArtistModal,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('mainview');
	const { collectionArtistState } = useTypedSelector((state) => state.client);
	const { setCollectionArtistModalState } = useActions();
	const router = useRouter();

	const toRecommendation = () => {
		const a = collectionArtistState.id;
		router.push({
			pathname: '/recommendation/',
			query: { artist: a },
		});
		setCollectionArtistModalState({ ...modalClose });
	};

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
									unFollowArtist(collectionArtistState.id)
								}
							/>
						) : (
							<NavbarModalButton
								ariaLabel={t(
									'collection.artists.modal.followArtistAria'
								)}
								content={t(
									'collection.artists.modal.followArtistText'
								)}
								fetching={fetching}
								onClick={() =>
									followArtist(collectionArtistState.id)
								}
							/>
						)}
						<NavbarModalButton
							ariaLabel={t(
								'collection.artists.modal.toRadioAria'
							)}
							content={t('collection.artists.modal.toRadioText')}
							fetching={fetching}
							onClick={() => toRecommendation()}
						/>

						<NavbarModalButton
							ariaLabel={t('collection.artists.modal.shareAria')}
							content={t('collection.artists.modal.shareText')}
							fetching={fetching}
							onClick={() => {
								shareHandler(
									'selectedArtist',
									collectionArtistState.id
								);
								setCollectionArtistModalState({
									...modalClose,
								});
							}}
						/>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(ArtistModal);
