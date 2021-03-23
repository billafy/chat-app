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
		const {height, width} = action.payload;
		return {
			...state,
			height: height,
			width: width,
		}
	}
	return state;
}