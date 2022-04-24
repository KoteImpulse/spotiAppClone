import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyAPI, { LOGIN_URL } from '../../../lib/spotify';

async function refreshAccessToken(token: JWT) {
	try {
		spotifyAPI.setAccessToken(token.access_token);
		spotifyAPI.setRefreshToken(token.refreshToken);

		const { body: refreshedToken } = await spotifyAPI.refreshAccessToken();
		return {
			...token,
			accessToken: refreshedToken.access_token,
			accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
			refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
		};
	} catch (error) {
		console.log(error);
		return {
			...token,
			error: 'RefreshAccessTokenError',
		};
	}
}

export default NextAuth({
	providers: [
		SpotifyProvider({
			clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
			clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
			authorization: LOGIN_URL,
		}),
	],
	session: { strategy: 'jwt' },
	jwt: { secret: process.env.JWT_SECRET },
	pages: { signIn: '/login' },
	callbacks: {
		async jwt({ token, user, account }: any) {
			if (account && user) {
				return {
					...token,
					accessToken: account.access_token,
					refreshToken: account.refresh_token,
					username: account.providerAccountId,
					accessTokenExpires: account.expires_at * 1000,
				};
			}
			if (Date.now() < token.accessTokenExpires) {
				return token;
			}
			return await refreshAccessToken(token);
		},
		async session({ session, token }: any) {
			session.user.accessToken = token.accessToken;
			session.user.refreshToken = token.refreshToken;
			session.user.username = token.username;
			return session;
		},
	},
	debug: false,
});
