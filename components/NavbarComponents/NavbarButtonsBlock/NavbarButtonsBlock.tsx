import React, { DetailedHTMLProps, FC, HTMLAttributes, useState } from 'react';
import cn from 'classnames';
import styles from './NavbarButtonsBlock.module.scss';
import NavbarButton from '../../Buttons/NavbarButton/NavbarButton';
import { IoAddOutline, IoHeartOutline } from 'react-icons/io5';
import NavbarLink from '../../Links/NavbarLink/NavbarLink';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useRouter } from 'next/router';

interface NavbarButtonsBlockProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const NavbarButtonsBlock: FC<NavbarButtonsBlockProps> = ({
	className,
	...props
}) => {
	const { t } = useTranslation('navbar');
	const { data: session } = useSession();
	const router = useRouter();
	const [fetching, setFetching] = useState<boolean>(false);
	const createPlaylist = async () => {
		setFetching(true);
		try {
			const playlist = await fetch(
				`https://api.spotify.com/v1/users/${session?.user.username}/playlists`,
				{
					method: 'POST',
					body: JSON.stringify({
						name: `${t('buttons.createPlayListName')}`,
						description: `${t('buttons.createPlayListDescr')}`,
						public: false,
						collaborative: false,
					}),
					headers: {
						Authorization: `Bearer ${session?.user.accessToken}`,
					},
				}
			).then((res) => (res ? res.json() : null));
			playlist.id &&
				router.push({
					pathname: '/playlist/[Slug]',
					query: { Slug: playlist.id },
				});
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
		}
	};

	return (
		<div className={cn(className, styles.navbarButtonsBlock)} {...props}>
			<div className={styles.createButtonContainer}>
				<NavbarButton
					content={t('buttons.createPlayListText')}
					ariaLabel={t('buttons.createPlayListAria')}
					icon={<IoAddOutline />}
					onClick={() => createPlaylist()}
					disabled={fetching}
					style={
						fetching
							? { cursor: 'not-allowed' }
							: { cursor: 'pointer' }
					}
				/>
			</div>

			<ul className={styles.likesLinkContainer}>
				<NavbarLink
					href={'/tracks'}
					content={t('buttons.likesText')}
					ariaLabel={t('buttons.likesAria')}
					icon={<IoHeartOutline />}
				/>
			</ul>
		</div>
	);
};

export default NavbarButtonsBlock;
