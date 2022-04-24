import React, {
	DetailedHTMLProps,
	Dispatch,
	HTMLAttributes,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './RangeInput.module.scss';

interface RangeInputProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	xMax: number;
	xMin: number;
	xStep: number;
	value: number;
	setValue: Dispatch<SetStateAction<number>>;
}

const RangeInput = ({
	xMax,
	xMin,
	xStep,
	value,
	setValue,
	className,
	...props
}: RangeInputProps): JSX.Element => {
	const refSlider = useRef<HTMLDivElement>(null);
	const [xPosPercent, setxPosPercent] = useState(0);
	const dragging = useRef(false);

	function getValueAndPercent(
		newPosition: number,
		el: HTMLDivElement | null
	): { value: number; xPercent: number } {
		const widthElement = el?.getBoundingClientRect().width;
		if (!widthElement) return { value: 0, xPercent: 0 };
		let x = newPosition;
		let dx = 0;
		let percent = 0;
		if (x < 0) {
			x = 0;
		}
		if (x > widthElement) {
			x = widthElement;
		}
		dx = Math.round((x / widthElement) * (xMax - xMin));
		percent = (x / widthElement) * 100;
		return {
			value: dx,
			xPercent: percent,
		};
	}
	const handleChangeValue = useCallback(() => {
		const percent = (value / (xMax - xMin)) * 100;
		setxPosPercent(percent);
	}, [value, xMax, xMin]);

	useEffect(() => {
		handleChangeValue();
	}, [value, xMax, xMin]);

	// const handleMouseMove = useCallback((e) => {
	// 	if (!dragging.current) {
	// 		return;
	// 	}
	// 	const element = e?.currentTarget?.getBoundingClientRect();
	// 	const change = e.clientX - element.left;
	// 	const { value, xPercent } = getValueAndPercent(
	// 		change,
	// 		refSlider.current
	// 	);
	// 	setxPosPercent(xPercent);
	// 	setValue(value);
	// }, []);

	// const handleMouseDown = useCallback((e: any) => {
	// 	dragging.current = true;
	// }, []);

	// const handleMouseUp = useCallback((e) => {
	// 	dragging.current = false;
	// 	const element = e?.currentTarget?.getBoundingClientRect();
	// 	const change = e.clientX - element.left;
	// 	const { value, xPercent } = getValueAndPercent(
	// 		change,
	// 		refSlider.current
	// 	);
	// 	setxPosPercent(xPercent);
	// 	setValue(value);
	// }, []);

	useEffect(() => {
		if (!refSlider) return;
		const refSliderConst = refSlider?.current;

		const handleMouseMove = (e: any) => {
			if (!dragging.current) {
				return;
			}
			const element = e?.currentTarget?.getBoundingClientRect();
			const change = e.clientX - element.left;
			const { value, xPercent } = getValueAndPercent(
				change,
				refSlider.current
			);
			setxPosPercent(xPercent);
			setValue(value);
		};

		const handleMouseDown = (e: any) => {
			dragging.current = true;
		};

		const handleMouseUp = (e: any) => {
			dragging.current = false;
			const element = e?.currentTarget?.getBoundingClientRect();
			const change = e.clientX - element.left;
			const { value, xPercent } = getValueAndPercent(
				change,
				refSlider.current
			);
			setxPosPercent(xPercent);
			setValue(value);
		};

		refSliderConst?.addEventListener('mousedown', handleMouseDown);
		refSliderConst?.addEventListener('mousemove', handleMouseMove);
		refSliderConst?.addEventListener('mouseup', handleMouseUp);
		return () => {
			refSliderConst?.removeEventListener('mousedown', handleMouseDown);
			refSliderConst?.addEventListener('mousemove', handleMouseMove);
			refSliderConst?.addEventListener('mouseup', handleMouseUp);
		};
	}, [setValue, value, xMax, xMin]);

	return (
		<div
			className={cn(className, styles.progressBar)}
			{...props}
			ref={refSlider}
		>
			<div className={styles.styledBar}>
				<div className={styles.styledBarBackground}>
					<div className={styles.line}>
						<div
							className={styles.lineProgress}
							style={{
								transform: `translateX(calc(-100% + ${xPosPercent}%)`,
							}}
						></div>
					</div>
					<div
						className={styles.thumb}
						style={{ left: `${xPosPercent}%` }}
					></div>
				</div>
			</div>
		</div>
	);
};

export default RangeInput;
