export const mainReducer = (state, action) => {
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
		return {...state, friends};
	}
	else if(action.type === 'REQ_SENT_INIT') {
		const {requests} = action.payload;
		return {...state, friendRequestsSent:requests};
	}
	else if(action.type === 'REQ_RECEIVED_INIT') {
		const {requests} = action.payload;
		return {...state, friendRequestsReceived:requests};
	}
	else if(action.type === 'MESSAGES_INIT') {
		const {messages} = action.payload;
		return {...state, messages};
	}
	else if(action.type === 'LAST_TEXTS') {
		const newFriends = state.friends.map(friend => {
			const texts =  state.messages.filter(message => {
								return friend.id === message.friendshipId;
							});
			return {
				...friend,
				lastText: texts.length > 0 ? {text:texts[texts.length-1].text,sender:texts[texts.length-1].sender} : []
			};
		})
		return {...state, friends:newFriends}
	}
	else if(action.type === 'SEND_REQUEST') {
		const {sent} = action.payload;
		return {
			...state,
			friendRequestsSent: [
				...state.friendRequestsSent,
				sent
			]
		};
	}
	else if(action.type === 'ACCEPT_REQUEST') {
		const {username, newFriend} = action.payload;
		const newRequests = state.friendRequestsReceived.filter(request => request.sender!==username);	
		return {
			...state,
			friendRequestsReceived: newRequests,
			friends: [
				...state.friends,
				newFriend
			],
		};
	}
	else if(action.type === 'REMOVE_REQUEST') {
		const {reqType, username} = action.payload;
		let newRequests;
		if(reqType==='SENT') {
			newRequests = state.friendRequestsSent.filter(request => request.receiver!==username);
			return {
				...state,
				friendRequestsSent: newRequests
			};
		}	
		newRequests = state.friendRequestsReceived.filter(request => request.sender!==username);
		return {
			...state,
			friendRequestsReceived: newRequests
		};
	}
	else if(action.type === 'REMOVE_FRIEND') {
		const {username} = action.payload;
		const newFriends = state.friends.filter(friend => {
			return (friend.user1!==username && friend.user2!==username);
		});		
		return {
			...state,
			friends: newFriends
		};
	}
	else if(action.type === 'SELECT_CONVERSATION') {
		const {conversation} = action.payload;
		if(state.conversation.length === conversation.length)
			return state;
		return {
			...state,
			conversation: conversation
		}
	}
	return state;
}