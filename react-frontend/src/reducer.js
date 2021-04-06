export const reducer = (state, action) => {
	if(action.type==='LOGIN') {
		const {account, token} = action.payload;
		return {
			...state,
			loggedIn: true,
			account: account,
			token: token
		};
	}
	else if(action.type==='LOGOUT') {
		return {
			...state,
			loggedIn: false,
			account: {},
			token: 0
		}
	}
	else if(action.type==='SCREEN_SIZE') {
		const {width} = action.payload;
        if(width===state.width)
            return state;
        if(width <= 768 && state.width <= 768)
            return state;
        else if(width > 768 && state.width > 768)
            return state;
		return {
			...state,
			width: width
		}
	}
	else if(action.type==='NEW_TOKEN') {
		const {token} = action.payload;
		return {
			...state,
			token:token
		}
	}
	return state;
}