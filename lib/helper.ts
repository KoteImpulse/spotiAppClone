import { SpotiReq } from './spotiReq';

export const msToTime = (duration: number = 0) => {
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

export const durationPlaylist = (array: any[]) => {
	const timeMs = array.reduce((acc: number, curr: any) => {
		acc = acc + curr.track.duration_ms;
		return acc;
	}, 0);
	return msToTime(timeMs);
};
export const durationAlbum = (array: any[]) => {
	const timeMs = array.reduce((acc: number, curr: any) => {
		acc = acc + curr.duration_ms;
		return acc;
	}, 0);
	return msToTime(timeMs);
};

export const modalPosition = (
	event: any,
	refModal: any,
	songId: string | undefined
) => {
	let xPosition = 0;
	let yPosition = 0;
	let mouseX = event.clientX || event.touches[0].clientX;
	let mouseY = event.clientY || event.touches[0].clientY;
	let menuHeight = refModal?.current?.getBoundingClientRect().height;
	let menuWidth = refModal?.current?.getBoundingClientRect().width;
	let width = window.innerWidth;
	let height = window.innerHeight;
	let inLibrary = true;

	if (menuHeight && menuWidth) {
		if (height - mouseY - 90 >= menuHeight) {
			if (width - mouseX < menuWidth) {
				xPosition = mouseX - menuWidth;
			} else {
				xPosition = mouseX;
			}
			yPosition = mouseY;
		} else {
			if (width - mouseX < menuWidth) {
				xPosition = mouseX - menuWidth;
			} else {
				xPosition = mouseX;
			}
			yPosition = mouseY - menuHeight;
		}
	}
	return {
		isOpened: true,
		songId: songId || '',
		x: xPosition,
		y: yPosition,
		height: menuHeight,
		width: menuWidth,
		inLibrary,
	};
};

export const modalStaticPos = (event: any, refModal: any) => {
	let xPosition = 0;
	let yPosition = 0;
	let mouseX = event.clientX || event.touches[0].clientX;
	let mouseY = event.clientY || event.touches[0].clientY;
	let menuHeight = refModal?.current?.getBoundingClientRect().height;
	let menuWidth = refModal?.current?.getBoundingClientRect().width;
	let width = window.innerWidth;
	let height = window.innerHeight;

	if (menuHeight && menuWidth) {
		if (height - mouseY - 90 >= menuHeight) {
			if (width - mouseX < menuWidth) {
				xPosition = mouseX - menuWidth;
			} else {
				xPosition = mouseX;
			}
			yPosition = mouseY;
		} else {
			if (width - mouseX < menuWidth) {
				xPosition = mouseX - menuWidth;
			} else {
				xPosition = mouseX;
			}
			yPosition = mouseY - menuHeight;
		}
	}
	return [xPosition, yPosition];
};
export const modalCollectionPos = (
	event: any,
	refModal: any,
	id: string | undefined,
	playlist?: boolean
) => {
	let xPosition = 0;
	let yPosition = 0;
	let mouseX = event.clientX || event.touches[0].clientX;
	let mouseY = event.clientY || event.touches[0].clientY;
	let menuHeight = refModal?.current?.getBoundingClientRect().height;
	let menuWidth = refModal?.current?.getBoundingClientRect().width;
	let width = window.innerWidth;
	let height = window.innerHeight;

	if (menuHeight && menuWidth) {
		if (height - mouseY - 90 >= menuHeight) {
			if (width - mouseX < menuWidth) {
				xPosition = mouseX - menuWidth;
			} else {
				xPosition = mouseX;
			}
			yPosition = mouseY;
		} else {
			if (width - mouseX < menuWidth) {
				xPosition = mouseX - menuWidth;
			} else {
				xPosition = mouseX;
			}
			yPosition = mouseY - menuHeight;
		}
	}

	return {
		isOpened: true,
		id: playlist ? id?.slice(3) || '' : id || '',
		x: xPosition,
		y: yPosition,
		height: menuHeight,
		width: menuWidth,
	};
};
export const modalNavbarPos = (
	event: any,
	refModal: any,
	id: string | undefined
) => {
	let xPosition = 0;
	let yPosition = 0;
	let mouseX = event.clientX || event.touches[0].clientX;
	let mouseY = event.clientY || event.touches[0].clientY;
	let menuHeight = refModal?.current?.getBoundingClientRect().height;
	let height = window.innerHeight;

	if (menuHeight) {
		if (height - mouseY - 90 >= menuHeight) {
			xPosition = mouseX;
			yPosition = mouseY;
		} else {
			xPosition = mouseX;
			yPosition = mouseY - menuHeight;
		}
	}
	return {
		isOpened: true,
		playlistId: id || '',
		x: xPosition,
		y: yPosition,
	};
};

export const modalClosePosition = {
	isOpened: false,
	songId: '',
	x: 0,
	y: 0,
	height: 0,
	width: 0,
	inLibrary: false,
};
export const modalCloseData = {
	songId: '',
	songURI: '',
};
export const modalClose = {
	isOpened: false,
	id: '',
	x: 0,
	y: 0,
	height: 0,
	width: 0,
	inLibrary: false,
};
export const modalNavClose = {
	isOpened: false,
	playlistId: '',
	x: 0,
	y: 0,
};
export const modalEditClose = {
	isOpened: false,
	id: '',
	name: '',
	description: '',
	image: '',
};
export const shareHandler = (
	type: 'selectedPlaylist' | 'selectedAlbum' | 'selectedArtist',
	id: string
) => {
	const urls = {
		selectedPlaylist: `${process.env.NEXT_PUBLIC_CLIENT_URL}/playlist/${id}`,
		selectedAlbum: `${process.env.NEXT_PUBLIC_CLIENT_URL}/album/${id}`,
		selectedArtist: `${process.env.NEXT_PUBLIC_CLIENT_URL}/artist/${id}`,
	};
	return navigator.clipboard.writeText(urls[type]);
};
export const songsFromPlaylist = async (
	id: string,
	limit: number,
	offset: number,
	token: string | undefined
) => {
	try {
		const songsFromPlaylist = await SpotiReq()
			.getTracks(id, limit, offset, token)
			.then((res) => (res ? res.json() : null));
		let total = songsFromPlaylist.total;
		let count = songsFromPlaylist.items.length;
		let songs = [...songsFromPlaylist.items];
		while (total - count > 0) {
			const songsFromPlaylist1 = await SpotiReq()
				.getTracks(id, limit, count, token)
				.then((res) => (res ? res.json() : null));
			songs = [...songs, ...songsFromPlaylist1.items];
			count = songs.length;
		}
		return songs;
	} catch (e) {
		console.log(e);
	}
};
