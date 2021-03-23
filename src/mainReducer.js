export const mainReducer = (state, action ) => {
	if(action.type === 'SEARCH_INPUT') {
		return {
			...state,
			searchInput: action.payload.searchInput,
		};
	}
	else if(action.type === 'SEARCH_LOAD') {
		return {
			...state, 
			searchLoading:true,
			searchAlert:'',
		}
	}
	else if(action.type === 'SEARCH_RESULTS') {
		const {searchResults} = action.payload
		let searchAlert = '';
		if(searchResults.length===0)
			searchAlert = 'No Results';
		return {
			...state,
			searchLoading: false,
			searchResults: searchResults,
			searchInput: '', 
			searchAlert: searchAlert,
		};
	}
	return state;
}