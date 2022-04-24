import {
	ISearchResult,
	SearchAction,
	SearchActionTypes,
} from '../../types/search';

export const setSearchData = (payload: ISearchResult): SearchAction => {
	return { type: SearchActionTypes.SET_SEARCH_DATA, payload };
};
