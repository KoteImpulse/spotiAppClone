import { User, UserAction, UserActionTypes } from '../../types/user';

export const setUser = (payload: User | null): UserAction => {
	return { type: UserActionTypes.SET_USER, payload };
};
