import React, {
	ChangeEvent,
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './SearchBlock.module.scss';
import { useTranslation } from 'next-i18next';
import SearchInput from '../../../CustomInputs/SearchInput/SearchInput';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';

interface SearchBlockProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const SearchBlock: FC<SearchBlockProps> = ({ className, ...props }) => {
	const { t } = useTranslation('topbar');
	const [searchValue, setSearchValue] = useState<string>('');
	const [timer, setTimer] = useState<any>(null);

	const handleChangeInput = async (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
		if (e.target.value.length === 0) {
		}
		if (timer) {
			clearTimeout(timer);
		}
		try {
			setTimer(
				setTimeout(async () => {
					//api req
				}, 1000)
			);
		} catch (e: any) {
			console.log(e?.response?.data.message);
		}
	};

	const setValue = () => {
		if (searchValue === '') {
			return;
		}
		setSearchValue('');
	};

	return (
		<div className={cn(className, styles.searchBlock)} {...props}>
			<form>
				<SearchInput
					searchValue={searchValue}
					handleChangeInput={handleChangeInput}
				/>
			</form>
			<div className={styles.formButtons}>
				<span
					className={styles.find}
					aria-label={t('content.searchBlock.inputButtonFindAria')}
				>
					<IoSearchOutline />
				</span>
				<button
					className={styles.clear}
					onClick={() => setValue()}
					aria-label={t('content.searchBlock.inputButtonClearAria')}
				>
					<IoCloseOutline />
				</button>
			</div>
		</div>
	);
};

export default SearchBlock;
