import React, {useState, useEffect, useContext, useReducer} from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from 'react-router-dom';
import {AppContext} from '../App';

import '../css/main.css';

import Sidebar from './Sidebar';
import MyProfile from './MyProfile';
import SearchResults from './SearchResults';

import {GiHamburgerMenu} from 'react-icons/gi';
import {AiOutlineSearch} from 'react-icons/ai';

import {mainReducer} from '../mainReducer';
import {urls} from '../urls';

const mainStates = {
	searchInput: '',
	searchResults: ['empty'],
	searchLoading: false,
	searchAlert: 'Find new friends by searching their username'
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

	const toggleSidebar = () => {
		setShowSidebar(!showSidebar);
	}

	const searchAccounts = async () => {
		dispatch({type:'SEARCH_LOAD'});
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


	return(
		<MainContext.Provider value={{
				state,
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
						<div className='content-container'>
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
								<Route path='/dashboard/profile/:id'>
									Profile								
								</Route>
								<Route path='/dashboard/conversation/:id'>
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