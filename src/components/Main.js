import React, {useState, useEffect, useContext, useReducer} from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from 'react-router-dom';
import {AppContext} from '../App';

import '../css/main.css';

import Sidebar from './Sidebar';
import MyProfile from './MyProfile';
import SearchResults from './SearchResults';
import Profile from './Profile';

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
};

export const MainContext = React.createContext();

const Main = () => {
	const [state, dispatch] = useReducer(mainReducer, mainStates);
	const {state:{account, token, height, width}} = useContext(AppContext);
	const [showSidebar, setShowSidebar] = useState(false);
	const history = useHistory();

	useEffect(() => {
		history.push('/dashboard');
	}, []);

	useEffect(() => {
		getFriends();
		getFriendRequestsSent();
		getFriendRequestsReceived();
		getMessages();
	}, []);

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
		dispatch({type:'MESSAGES_INIT',payload:{messages}});
	}

	const getProfileStatus = (username) => {
		const alreadyFriends = state.friends.filter((friend) => friend.username === username)[0];
		if(alreadyFriends)
			return 'FRIEND';
		const requestSent = state.friendRequestsSent.filter((request) => request.sender === username)[0];
		if(requestSent)
			return 'REQUEST_SENT';
		const requestReceived = state.friendRequestsReceived.filter((request) => request.receiver === username)[0];
		if(requestReceived)
			return 'REQUEST_RECEIVED';
		return '';
	}

	return(
		<MainContext.Provider value={{
				state,
				getProfileStatus
			}}>
			<section className='main-container' style={width > 568 ? {minHeight:height-200,maxHeight:'auto'} : {minHeight:height,maxHeight:'auto'}}>
				<Router>
					<Sidebar toggleSidebar={toggleSidebar} showSidebar={showSidebar}/>
					<div className='main-page' style={width < 568 ? {minHeight:height-100,maxHeight:'auto'} : {}}>
						<div className='search-bar'>
							{width < 568 && <button type='button' onClick={toggleSidebar}><GiHamburgerMenu/></button>}
							<Link to='/dashboard/search'>
								<input type='text' value={state.searchInput} onChange={(event)=>dispatch({type:'SEARCH_INPUT',payload:{searchInput:event.target.value}})}/>
							</Link>
							<button onClick={searchAccounts}><AiOutlineSearch/></button>
						</div>
						<div className='content-container' style={width > 568 ? {height:height-295} : {height:height-195}}>
							<Switch>
								<Route exact path='/dashboard/'>
									Chats
								</Route>
								<Route path='/dashboard/notifications'>
									Notifications
								</Route>
								<Route path='/dashboard/myprofile'>
									<MyProfile/>
								</Route>
								<Route path='/dashboard/profile/:username'>
									<Profile/>								
								</Route>
								<Route path='/dashboard/conversation/:username'>
									Conversation								
								</Route>
								<Route path='/dashboard/search'>
									<SearchResults/>							
								</Route>
								<Route path='/dashboard/*'>
									Chats - error
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