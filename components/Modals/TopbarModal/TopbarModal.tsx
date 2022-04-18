import React, {
	DetailedHTMLProps,
	FC,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	MutableRefObject,
} from 'react';

import ModalLayout from '../../../layout/Modal/ModalLayout';
import TopbarModalLink from '../../Links/TopbarModalLink/TopbarModalLink';
import TopbarModalButton from '../../Buttons/TopbarModalButton/TopbarModalButton';
import { useActions } from '../../../hooks/useActions';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

interface TopbarModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const TopbarModal = (
	{ className, ...props }: TopbarModalProps,
	ref: ForwardedRef<HTMLDivElement>
) => {
	const { t } = useTranslation('topbar');
	const { setTopbarModalState } = useActions();

	const logoutHandle = () => {
		setTopbarModalState(false);
		signOut();
	};

	return (
		<ModalLayout ref={ref}>
			<TopbarModalLink
				href={'/user'}
				ariaLabel={t('modal.profileLinkAria')}
				content={t('modal.profileLinkText')}
				onClick={() => setTopbarModalState(false)}
			/>
			<TopbarModalButton
				ariaLabel={t('modal.quitButtonAria')}
				content={t('modal.quitButtonText')}
				onClick={() => logoutHandle()}
			/>
		</ModalLayout>
	);
};

export default forwardRef(TopbarModal);
