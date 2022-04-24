import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	useEffect,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './EditModalDescription.module.scss';
import { useTranslation } from 'next-i18next';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { modalEditClose } from '../../../lib/helper';

interface EditModalDescriptionProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	text: string;
}

const EditModalDescription = (
	{ text, className, ...props }: EditModalDescriptionProps,
	ref: ForwardedRef<HTMLTextAreaElement>
): JSX.Element => {
	const { t } = useTranslation('common');
	const { editModalState } = useTypedSelector((state) => state.client);
	const { setEditModalState } = useActions();
	const [focused, setFocused] = useState<boolean>(false);
	const [value, setValue] = useState<string>('');
	const refContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function clickHandler(event: any) {
			if (!refContainer) return;
			if (editModalState.isOpened === true) {
				if (
					refContainer?.current &&
					!refContainer?.current.contains(event.target)
				) {
					setFocused(false);
				}
			}
		}
		window.addEventListener('click', clickHandler);
		return () => {
			window.removeEventListener('click', clickHandler);
		};
	}, [editModalState, refContainer]);

	useEffect(() => {}, [value]);

	return (
		<div
			className={cn(className, styles.editModalDescription)}
			{...props}
			ref={refContainer}
		>
			<label
				htmlFor='name'
				className={cn(styles.styledLabel, {
					[styles.active]: focused,
				})}
			>
				{t('modalEditPlaylist.inputDescription')}
			</label>
			<textarea
				aria-label={t('modalEditPlaylist.inputDescriptionAria')}
				name='name'
				maxLength={300}
				minLength={1}
				autoComplete='off'
				defaultValue={text}
				ref={ref}
				className={cn(styles.styledInput, {
					[styles.active]: focused,
				})}
				onFocus={(e) => {
					setValue(e.target.value);
					setFocused(true);
				}}
				onChange={(e) => setValue(e.target.value)}
			/>
			{value.length > 250 && (
				<span
					className={styles.styledAbacus}
				>{`${value.length} / 300`}</span>
			)}
		</div>
	);
};

export default forwardRef(EditModalDescription);
