import React, {
	ChangeEvent,
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
} from 'react';
import cn from 'classnames';
import styles from './SearchInput.module.scss';
import { useTranslation } from 'next-i18next';

interface SearchInputProps
	extends DetailedHTMLProps<
		HTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	searchValue: string;
	handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: FC<SearchInputProps> = ({
	searchValue,
	handleChangeInput,
	className,
	...props
}) => {
	const { t } = useTranslation('topbar');

	return (
		<input
			type='text'
			maxLength={100}
			autoCorrect='off'
			autoCapitalize='off'
			spellCheck='false'
			className={cn(className, styles.searchInput)}
			placeholder={t('content.searchBlock.inputPlaceholderText')}
			value={searchValue}
			onChange={handleChangeInput}
			{...props}
		/>
	);
};

export default SearchInput;
