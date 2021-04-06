import React, {useState, useEffect, useContext, useReducer} from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from 'react-router-dom';
import {AppContext} from '../App';

import '../css/main.css';

import Chats from './Chats';
import Conversation from './Conversation';
import Sidebar from './Sidebar';
import MyProfile from './MyProfile';
import SearchResults from './SearchResults';
import Profile from './Profile';
import Notifications from './Notifications';

import {GiHamburgerMenu} from 'react-icons/gi';
import {AiOutlineSearch} from 'react-icons/ai';

import {mainReducer} from '../mainReducer';
import {urls} from '../urls';

const mainStates = {
	searchInput: '',
	searchResults: [],
	searchLoading: false,
	searchAlert: 'Find new friends by searching their username',
	friends: [],
	friendRequestsSent: [],
	friendRequestsReceived: [],
	messages: [],
	conversation: [],
};

export const MainContext = React.createContext();

const Main = () => {
	const [state, dispatch] = useReducer(mainReducer, mainStates);
	const {state:{account, token, height, width}} = useContext(AppContext);
	const [showSidebar, setShowSidebar] = useState(false);
	const history = useHistory();

	const toggleSidebar = () => {
		setShowSidebar(!showSidebar);
	}

	const searchAccounts = async () => {
		dispatch({type:'SEARCH_LOAD'});
		if(!state.searchInput) {
			dispatch({type:'SEARCH_INIT'});
			return;
		}
		const url = urls.accountSearch + state.searchInput + '/';
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: 'Token '+ token,
			}
		});
		const searchResults = await response.json();
		dispatch({type:'SEARCH_RESULTS',payload:{searchResults}});
	}

	const getFriends = async () => {
		const url = urls.getFriends + account.username + '/';
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: 'Token ' + token
			}
		});
		const friends = await response.json();
		dispatch({type:'FRIENDS_INIT',payload:{friends}});
	}

	const getFriendRequestsSent = async () => {
		const url = urls.getFriendRequestsSent + account.username + '/';
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: 'Token ' + token
			}
		});
		const requests = await response.json();
		if(state.friendRequestsSent.length !== requests.length)
			dispatch({type:'REQ_SENT_INIT',payload:{requests}});
	}

	const getFriendRequestsReceived = async () => {
		const url = urls.getFriendRequestsReceived + account.username + '/';
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: 'Token ' + token
			}
		});
		const requests = await response.json();
		if(state.friendRequestsReceived.length !== requests.length)
			dispatch({type:'REQ_RECEIVED_INIT',payload:{requests}});
	}

	const getMessages = async () => {
		const url = urls.getMessages + account.username + '/';
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: 'Token ' + token
			}
		});
		const messages = await response.json();
		if(state.messages.length !== messages.length)
			dispatch({type:'MESSAGES_INIT',payload:{messages}});
	}

	const getProfileStatus = async (username) => {
		const alreadyFriends = state.friends.filter((friend) => {
			return ((friend.user1===username) || (friend.user2===username));
		})[0];
		if(alreadyFriends)
			return 'FRIEND';
		const requestSent = state.friendRequestsSent.filter((request) => request.receiver === username)[0];
		if(requestSent)
			return 'REQUEST_SENT';
		const requestReceived = state.friendRequestsReceived.filter((request) => request.sender === username)[0];
		if(requestReceived)
			return 'REQUEST_RECEIVED';
		return '';
	}

	const sendFriendRequest = async (username) => {
		const url = urls.sendFriendRequest;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: 'Token '+token,
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({sender:account.username,receiver:username})
		});
		const sent = await response.json();
		if(sent)
			dispatch({type:'SEND_REQUEST',payload:{sent}});
	}

	const acceptFriendRequest = async (username) => {
		const url = urls.acceptFriendRequest;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: 'Token '+token,
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({sender:username,receiver:account.username})
		});
		const accepted = await response.json();
		if(accepted)
			dispatch({type:'ACCEPT_REQUEST',payload:{username,newFriend:accepted}});
	}

	const removeFriendRequest = async (username) => {
		const url = urls.removeFriendRequest;
		let body;
		let reqType;
		if(state.friendRequestsSent.filter(request => request.receiver===username)[0]) {
			reqType = 'SENT';
			body = {sender:account.username,receiver:username};
		}
		else {
			reqType = 'RECEIVED';
			body = {sender:username,receiver:account.username};
		}
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: 'Token '+token,
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify(body)
		});
		const removed = await response.json();
		if(removed)
			dispatch({type:'REMOVE_REQUEST',payload:{username,reqType}});
	}

	const removeFriend = async (username) => {
		const url = urls.removeFriend;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: 'Token '+token,
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({user1:account.username,user2:username})
		});
		const removed = await response.json();
		if(removed)
			dispatch({type:'REMOVE_FRIEND',payload:{username}});
	}

	const sendMessage = async (friendshipId, receiver, text) => {
		const url = urls.sendMessage;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: 'Token '+token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({sender:account.username,receiver,friendshipId,text})
		})
		const message = await response.json();
		if(message)
			dispatch({type:'SEND_MESSAGE',payload:{message}})
		return message;
	}

	const getLastTexts = async () => {
		dispatch({type:'LAST_TEXTS'});
	}

	const selectConversation = async (conversation) => {
		dispatch({type:'SELECT_CONVERSATION',payload:{conversation}});
	}

	useEffect(() => {
		history.push('/dashboard');
		getFriendRequestsSent();
		getFriends();
		getFriendRequestsReceived();
	}, []);

	useEffect(() => {
		getMessages();
	}, []);

	return(
		<MainContext.Provider value={{
				state,
				getProfileStatus,
				sendFriendRequest,
				acceptFriendRequest,
				removeFriendRequest,
				removeFriend,
				getFriends,
				getFriendRequestsReceived,
				getFriendRequestsSent,
				getLastTexts,
				getMessages,
				sendMessage,
				selectConversation,
			}}>
			<section className='main-container' style={width > 768 ? {minHeight:height-200,maxHeight:'auto'} : {minHeight:height-100,maxHeight:'auto'}}>
				<Router>
					<Sidebar toggleSidebar={toggleSidebar} showSidebar={showSidebar}/>
					<div className='main-page' style={width < 768 ? {minHeight:height-100,maxHeight:'auto'} : {}}>
						<div className='search-bar'>
							{width < 768 && <button type='button' onClick={toggleSidebar}><GiHamburgerMenu/></button>}
							<Link to='/dashboard/search'>
								<input type='text' value={state.searchInput} onChange={(event)=>dispatch({type:'SEARCH_INPUT',payload:{searchInput:event.target.value}})}/>
							</Link>
							<button onClick={searchAccounts}><AiOutlineSearch/></button>
						</div>
						<div className='content-container' style={width > 768 ? {height:height-295} : {height:height-195}}>
							<Switch>
								<Route exact path='/dashboard/notifications'>
									<Notifications/>
								</Route>
								<Route exact path='/dashboard/myprofile'>
									<MyProfile/>
								</Route>
								<Route exact path='/dashboard/profile/:username'>
									<Profile/>								
								</Route>
								<Route exact path='/dashboard/conversation/:id/:username'>
									<Conversation/>								
								</Route>
								<Route exact path='/dashboard/search'>
									<SearchResults/>							
								</Route>
								<Route exact path={['/dashboard','/dashboard/*','*']}>
									<Chats/>
								</Route>
							</Switch>
						</div>
					</div>
				</Router>
			</section>
		</MainContext.Provider>		
	);
}

export default Main;