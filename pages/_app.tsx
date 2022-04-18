import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { wrapper } from '../store';
import App from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { getSession, SessionProvider } from 'next-auth/react';
import { setPlaylist } from '../store/action-creators/playlist';
import { setUser } from '../store/action-creators/user';

const WrappedApp = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) => {
	return (
		<>
			<Head>
				<title>MusicApp</title>
				<link rel='icon' href='/favicon.ico' />
				<meta name='robots' content='index' />
				<meta name='viewport' content='width=device-width' />
			</Head>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
};

WrappedApp.getInitialProps = wrapper.getInitialAppProps(
	(store) => async (context: any) => {
		const { ctx } = context;
		const dispatch = store.dispatch;
		try {
			const session = await getSession(context);
			if (session) {
				const playlists = await fetch(
					`https://api.spotify.com/v1/me/playlists?&limit=50`,
					{
						headers: {
							Authorization: `Bearer ${session?.user.accessToken}`,
						},
					}
				).then((res) => {
					return res ? res.json() : null;
				});

				if (playlists?.items.length >= 0) {
					dispatch(setPlaylist(playlists.items));
				}
				const user = await fetch(`https://api.spotify.com/v1/me`, {
					headers: {
						Authorization: `Bearer ${session?.user.accessToken}`,
					},
				}).then((res) => {
					return res ? res.json() : null;
				});
				if (user.id) {
					dispatch(setUser(user));
				}
			}
			return {
				pageProps: {
					session: session,
					...(await App.getInitialProps(context)).pageProps,
					pathname: ctx.pathname,
				},
			};
		} catch (e) {
			dispatch(setPlaylist([]));
			return {
				pageProps: {
					...(await App.getInitialProps(context)).pageProps,
					pathname: ctx.pathname,
				},
			};
		}
	}
);

export default appWithTranslation(wrapper.withRedux(WrappedApp));
