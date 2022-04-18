namespace NodeJS {
	interface ProcessEnv extends NodeJS.ProcessEnv {
		NEXT_PUBLIC_CLIENT_ID: string;
		NEXT_PUBLIC_CLIENT_SECRET: string;
		NEXTAUTH_URL: string;
		JWT_SECRET: string;
	}
}
