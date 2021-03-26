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
	else if(action.type === 'SEARCH_INIT') {
		return {
			...state,
			searchResults: [],
			searchLoading: false,
			searchAlert: 'Find new friends by searching their username'
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
			searchAlert: searchAlert,
		};
	}
	else if(action.type === 'FRIENDS_INIT') {
		const {friends} = action.payload;
		console.log(friends);
		return {...state, friends};
	}
	else if(action.type === 'REQ_SENT_INIT') {
		const {requests} = action.payload;
		console.log(requests);
		return {...state, friendRequestsSent:requests};
	}
	else if(action.type === 'REQ_RECEIVED_INIT') {
		const {requests} = action.payload;
		console.log(requests);
		return {...state, friendRequestsReceived:requests};
	}
	else if(action.type === 'MESSAGES_INIT') {
		const {messages} = action.payload;
		console.log(messages);
		return {...state, messages};
	}
	return state;
}