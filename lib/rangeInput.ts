type BaseProps = Required<
	Pick<
		RangeSliderProps,
		'axis' | 'xMax' | 'xMin' | 'xStep' | 'yMax' | 'yMin' | 'yStep'
	>
>;
export interface RangeSliderProps {
	axis?: 'x' | 'y' | 'xy';
	onAfterEnd?: (
		position: RangeSliderPosition,
		props: RangeSliderProps
	) => void;
	onChange?: (position: RangeSliderPosition, props: RangeSliderProps) => void;
	onDragEnd?: (
		position: RangeSliderPosition,
		props: RangeSliderProps
	) => void;
	x?: number;
	xMax?: number;
	xMin?: number;
	xStep?: number;
	y?: number;
	yMax?: number;
	yMin?: number;
	yStep?: number;
}
export interface RangeSliderPosition {
	x: number;
	y: number;
}
export interface RangeSliderSize {
	height?: string;
	width?: string;
}
export function getBaseProps(props?: RangeSliderProps): BaseProps {
	return {
		axis: props?.axis ?? 'x',
		xMax: props?.xMax ?? 100,
		xMin: props?.xMin ?? 0,
		xStep: props?.xStep ?? 1,
		yMax: props?.yMax ?? 100,
		yMin: props?.yMin ?? 0,
		yStep: props?.yStep ?? 1,
	};
}
export function round(value: number, increment: number): number {
	return Math.ceil(value / increment) * increment;
}
export const getPosition = (
	props: RangeSliderProps,
	position: { x: number; y: number },
	el: HTMLDivElement | null
) => {
	const { axis, xMax, xMin, xStep, yMax, yMin, yStep } = getBaseProps(props);
	const { height = xMax, width = yMax } = el?.getBoundingClientRect() || {};
	let { x, y } = position;
	let dx = 0;
	let dy = 0;

	if (x < 0) {
		x = 0;
	}

	if (x > width) {
		x = width;
	}

	if (y < 0) {
		y = 0;
	}

	if (y > height) {
		y = height;
	}

	if (axis === 'x' || axis === 'xy') {
		dx = Math.round((x / width) * (xMax - xMin));
	}

	if (axis === 'y' || axis === 'xy') {
		dy = Math.round((y / height) * (yMax - yMin));
	}

	return {
		x: round(dx, xStep),
		y: round(dy, yStep),
	};
};

export function getNormalizedValue(
	name: 'x' | 'y',
	props: RangeSliderProps
): number {
	const value = props[name] || 0;
	const min = name === 'x' ? props.xMin : props.yMin;
	const max = name === 'x' ? props.xMax : props.yMax;

	if (isNumber(min) && value < min) {
		return min;
	}

	if (isNumber(max) && value > max) {
		return max;
	}

	return value;
}

export function getCoordinates(
  event: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent,
  lastPosition: RangeSliderPosition,
): RangeSliderPosition {
  if ('touches' in event) {
    const [touch] = [...Array.from(event.touches)];
    return {
      x: touch ? touch.clientX : lastPosition.x,
      y: touch ? touch.clientY : lastPosition.y,
    };
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
}

export function isNumber(value: unknown): value is number {
	return typeof value === 'number';
}

export function isUndefined(value: unknown): value is undefined {
	return typeof value === 'undefined';
}

export function parseNumber(value: string | number): number {
	if (typeof value === 'number') {
		return value;
	}

	return parseInt(value, 10);
}
