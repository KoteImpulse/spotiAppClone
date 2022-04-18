import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './Login.module.scss';
import { useTranslation } from 'next-i18next';
import { signIn } from 'next-auth/react';
import LoginLink from '../Links/LoginLink/LoginLink';

interface LoginProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	providers: any;
}

const Login: FC<LoginProps> = ({ providers, className, ...props }) => {
	const { t } = useTranslation('common');
	return (
		<div className={cn(className, styles.login)} {...props}>
			<div className={styles.container}>
				{Object.values(providers).map((provider: any) => {
					return (
						<LoginLink
							key={provider.name}
							ariaLabel={t('loginPage.loginAria')}
							onClick={() =>
								signIn(provider.id, { callbackUrl: '/' })
							}
							content={`${t('loginPage.loginText')} ${
								provider.name
							}`}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default Login;
