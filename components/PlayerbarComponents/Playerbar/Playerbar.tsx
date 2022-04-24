import React, {
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	useEffect,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './Playerbar.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import {
	IoPlaySkipBackOutline,
	IoPlaySkipForwardOutline,
	IoRepeatOutline,
	IoShuffleOutline,
	IoNewspaperOutline,
	IoMenuOutline,
	IoVolumeHighOutline,
	IoVolumeMediumOutline,
	IoVolumeLowOutline,
	IoVolumeMuteOutline,
	IoPlayCircleOutline,
	IoPauseCircleOutline,
} from 'react-icons/io5';
import RangeInput from '../../CustomInputs/RangeInput/RangeInput';
import { useActions } from '../../../hooks/useActions';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { msToTime } from '../../../lib/helper';

interface PlayerbarProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Playerbar: FC<PlayerbarProps> = ({ className, ...props }) => {
	const { setSongData, setCurrentSong, setIsPlaying } = useActions();
	const { songData, currentSong, isPlaying } = useTypedSelector(
		(state) => state.client
	);

	const [value, setValue] = useState(0);
	const [value1, setValue1] = useState(0);

	useEffect(() => {
		setValue(0);
	}, [currentSong, currentSong.duration_ms]);

	const setVolume = (vol: number) => {
		switch (true) {
			case vol === 0:
				return <IoVolumeMuteOutline />;
			case vol < 30:
				return <IoVolumeLowOutline />;
			case vol < 70:
				return <IoVolumeMediumOutline />;
			case vol >= 70:
				return <IoVolumeHighOutline />;
			default:
				break;
		}
	};
	return (
		<div className={cn(className, styles.playerbar)} {...props}>
			<div className={styles.playerContainer}>
				<div className={styles.playerLeft}>
					<div className={styles.playerLeftInfo}>
						{currentSong?.album && (
							<div className={styles.playerLeftImage}>
								<Image
									src={
										`https://res.cloudinary.com/demo/image/fetch/${currentSong.album.images[2].url}` ||
										`/noImg.png`
									}
									layout='fixed'
									width={40}
									height={40}
									alt={currentSong?.name}
									className={styles.image}
									quality={40}
								/>
							</div>
						)}
						<div className={styles.playerLeftTitle}>
							<div>
								<div>
									<div>
										{currentSong.album && (
											<span className={styles.titleSong}>
												<Link
													href={`/album/${currentSong?.album.id}`}
												>
													<a>{currentSong?.name}</a>
												</Link>
											</span>
										)}
									</div>
								</div>
							</div>
							<span className={styles.titleArtist}>
								{currentSong.artists && (
									<Link
										href={`/artist/${currentSong.artists[0].id}`}
									>
										<a>{currentSong?.artists[0].name}</a>
									</Link>
								)}
							</span>
						</div>
					</div>
				</div>
				<div className={styles.playerCenter}>
					<div className={styles.playerControls}>
						<div className={styles.playerControlsButtons}>
							<div className={styles.playerControlsLeftButtons}>
								<button className={styles.shuffleButton}>
									<IoShuffleOutline />
								</button>
								<button className={styles.previousButton}>
									<IoPlaySkipBackOutline />
								</button>
							</div>
							<button
								className={styles.playButton}
								onClick={() => {
									setSongData({
										songId: currentSong.id,
										songURI: currentSong.uri,
									});
									setIsPlaying(!isPlaying);
								}}
							>
								{isPlaying ? (
									<IoPauseCircleOutline />
								) : (
									<IoPlayCircleOutline />
								)}
							</button>
							<div className={styles.playerControlsRightButtons}>
								<button
									className={styles.nextButton}
									onClick={() => setValue((prev) => prev + 1)}
								>
									<IoPlaySkipForwardOutline />
								</button>
								<button
									className={styles.repeatButton}
									onClick={() => setValue(100)}
								>
									<IoRepeatOutline />
								</button>
							</div>
						</div>
						{currentSong.duration_ms && (
							<div className={styles.playerControlsSlider}>
								<div className={styles.progressTime}>
									{value || 0}
								</div>
								<RangeInput
									xMax={Math.floor(
										currentSong.duration_ms / 1000
									)}
									xMin={0}
									xStep={1}
									value={value}
									setValue={setValue}
								/>

								<div className={styles.songDuration}>
									{msToTime(currentSong.duration_ms)}
								</div>
							</div>
						)}
					</div>
				</div>
				<div className={styles.playerRight}>
					<div className={styles.playerRightControls}>
						<button
							className={styles.lyricsButton}
							onClick={() => setValue1(0)}
						>
							<IoNewspaperOutline />
						</button>
						<button
							className={styles.queueButton}
							onClick={() => setValue1((prev) => prev - 5)}
						>
							<IoMenuOutline />
						</button>
					</div>
					<div className={styles.volumeBar}>
						<button
							className={styles.muteButton}
							onClick={() => setValue1((prev) => prev + 5)}
						>
							{setVolume(value1)}
						</button>
						<RangeInput
							xMax={100}
							xMin={0}
							xStep={1}
							value={value1}
							setValue={setValue1}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(Playerbar);
