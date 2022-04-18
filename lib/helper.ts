export const msToTime = (duration: number = 172982001) => {
	const dur = Math.floor(duration / 1000);
	const hours = Math.trunc(dur / 3600);
	const minutes = Math.trunc((dur % 3600) / 60);
	const seconds = Math.floor(dur - 60 * minutes - 3600 * hours);
	return `${hours > 0 ? `${hours}:` : ``}${
		minutes ? `${minutes < 10 ? `0${minutes}` : minutes}:` : ``
	}${
		seconds
			? `${minutes && seconds < 10 ? `0${seconds}` : seconds}`
			: minutes
			? `00`
			: `-`
	}`;
};

export const durationAlbum = (array: any[]) => {
	const timeMs = array.reduce((acc: number, curr: any) => {
		acc = acc + curr.track.duration_ms;
		return acc;
	}, 0);
	return msToTime(timeMs);
};
