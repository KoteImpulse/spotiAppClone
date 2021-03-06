import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session {
		user: {
			accessToken: string;
			email: string;
			name: string;
			refreshToken: string;
			username: string;
		};
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken: string;
		refreshToken: string;
		username: string;
		accessTokenExpires: number;
	}
}
