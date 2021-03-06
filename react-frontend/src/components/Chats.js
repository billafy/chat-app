import React, {useState, useEffect, useContext} from 'react';

import {AiOutlineReload} from 'react-icons/ai';

import {Link} from 'react-router-dom';

import {AppContext} from '../App';
import {MainContext} from './Main';

import Loading from './Loading';

import '../css/chats.css';
import profilePicture from '../images/profilepicture.png';

const Chats = () => {
	const {state:{account}} = useContext(AppContext);
	const {state:{friends}, getFriends, getMessages, getLastTexts} = useContext(MainContext);
	const [reloadClass, setReloadClass] =  useState('reload');
	
	useEffect(() => {
		reloadFriends();
	}, [])

	useEffect(() => {
		const messageFetcher = setInterval(() => {
			reloadFriends();
		}, 5000)
		return () => clearInterval(messageFetcher);
	}, [])

	const reloadFriends = () => {
		setReloadClass('reload reload-spin')
		getMessages();
		getFriends()
		.then(() => {
			getLastTexts();
			setReloadClass('reload')
		});
	}

	return (
		<section className='chats'>	
			<h1>Chats</h1>
			<button onClick={reloadFriends} className={reloadClass}><AiOutlineReload/></button>
			{friends 
				?
					friends.length > 0
					? 
						friends.map(friend => {
							return (
								<Link to={`/dashboard/conversation/${friend.id}/${friend.user1 === account.username ? friend.user2 : friend.user1}`} className='chat' key={friend.id}>
									<img src={profilePicture}/>
									<div>
										<p>{friend.user1 === account.username ? friend.user2 : friend.user1}</p>
										{friend.lastText &&<span>{friend.lastText.sender === account.username && 'You :'} {friend.lastText.text}</span>}
									</div>
								</Link>	
							);
						})
					:
					<div className='no-friends'>
						<p>You don't have any friends</p>
						<Link to='/dashboard/search'>
							<button>Find Friends</button>
						</Link>
					</div>
				:
				<Loading/>
			}
		</section>	
	);
}

export default Chats;