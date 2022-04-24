import React, {
	DetailedHTMLProps,
	FC,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	useEffect,
	useRef,
	useState,
} from 'react';
import cn from 'classnames';
import styles from './EditPlaylistModal.module.scss';
import { useTranslation } from 'next-i18next';
import { IoCloseOutline } from 'react-icons/io5';
import Image from 'next/image';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useActions } from '../../../hooks/useActions';
import { modalEditClose } from '../../../lib/helper';
import EditModalName from '../../CustomInputs/EditModalName/EditModalName';
import EditModalDescription from '../../CustomInputs/EditModalDescription/EditModalDescription';
import { SpotiReq } from '../../../lib/spotiReq';
import { useSession } from 'next-auth/react';
import { Playlist } from '../../../types/playlist';

interface EditPlaylistModalProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const EditPlaylistModal = (
	{ className, ...props }: EditPlaylistModalProps,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	const { t } = useTranslation('common');
	const { data: session } = useSession();
	const { editModalState } = useTypedSelector((state) => state.client);
	const { userPlaylists, selectedPlaylist } = useTypedSelector(
		(state) => state.server
	);
	const [fetching, setFetching] = useState<boolean>(false);
	const { setEditModalState, setPlaylist, selectPlaylist } = useActions();
	const refName = useRef<HTMLInputElement>(null);
	const refDescription = useRef<HTMLTextAreaElement>(null);

	const sendData = async () => {
		const name = refName?.current?.value;
		const descr = refDescription?.current?.value;

		setFetching(true);
		try {
			if (
				name &&
				descr &&
				name?.trim().length > 0 &&
				descr?.trim().length > 0
			) {
				await SpotiReq().changeDetails(
					editModalState.id,
					name,
					descr,
					session?.user.accessToken
				);
				const pl = userPlaylists.playlistsArray.find(
					(item: Playlist) => item.id === editModalState.id
				);
				pl.name = name;
				pl.description = descr;
				setPlaylist({
					playlistsArray: userPlaylists.playlistsArray,
					total: userPlaylists.total,
				});
				if (selectedPlaylist?.id === editModalState.id) {
					selectedPlaylist.name = name;
					selectedPlaylist.description = descr;
					selectPlaylist(selectedPlaylist);
				}
			}
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
			setEditModalState({ ...modalEditClose });
		}
	};

	return (
		<div className={cn(className, styles.editPlaylistModal)} {...props}>
			<div className={styles.modalContainer} ref={ref}>
				<div className={styles.modalHeader}>
					<h2 className={styles.headerText}>
						{t('modalEditPlaylist.headerText')}
					</h2>
					<button
						className={styles.closeButton}
						aria-label={t('modalEditPlaylist.closeAria')}
						onClick={() => setEditModalState({ ...modalEditClose })}
						disabled={fetching}
						style={
							fetching
								? { cursor: 'not-allowed' }
								: { cursor: 'default' }
						}
					>
						<IoCloseOutline />
					</button>
				</div>
				<div className={styles.modalContent}>
					<div className={styles.modalImage}>
						<Image
							src={editModalState?.image || '/noImg.png'}
							width={180}
							height={180}
							objectFit='cover'
							alt='img'
						/>
					</div>
					<div className={styles.modalInputName}>
						<EditModalName
							text={editModalState.name}
							ref={refName}
						/>
					</div>
					<div className={styles.modalInputDescription}>
						<EditModalDescription
							text={editModalState.description}
							ref={refDescription}
						/>
					</div>
					<div className={styles.modalSendButton}>
						<button
							className={styles.sendButton}
							aria-label={t('modalEditPlaylist.saveButtonAria')}
							onClick={() => sendData()}
							disabled={fetching}
							style={
								fetching
									? { cursor: 'not-allowed' }
									: { cursor: 'default' }
							}
						>
							{t('modalEditPlaylist.saveButtonText')}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(EditPlaylistModal);
