import React, {useContext} from 'react';
import {Link} from 'react-router-dom';

import {MainContext} from './Main';

import {AppContext} from '../App';

const ProfileActions = ({username, status, friend}) => {
	const {sendFriendRequest, acceptFriendRequest, removeFriendRequest, removeFriend} = useContext(MainContext);
	const {state: {account}} = useContext(AppContext);

	if(status==='FRIEND') {
		return (
			<>
				<div className='profile-action-buttons'>
					<Link to={friend && `/dashboard/conversation/${friend.id}/${friend.user1 === account.username ? friend.user2 : friend.user1}`} style={{marginRight:10}}>
						<button className='normal-btn'>Message</button>
					</Link>
					<button className='red-btn' onClick={()=>removeFriend(username)}>Unfriend</button>
				</div>
			</>				
		);
	}
	else if(status==='REQUEST_SENT') {
		return (
			<>
				<p>You have sent a friend request to {username}</p>
				<div className='profile-action-buttons'>
					<button className='red-btn' onClick={()=>removeFriendRequest(username)}>Cancel</button>
				</div>
			</>	
		);
	}
	else if(status==='REQUEST_RECEIVED') {
		return (
			<>
				<p>{username} has sent you a friend request</p>
				<div className='profile-action-buttons'>
					<button className='green-btn' onClick={()=>acceptFriendRequest(username)} style={{marginRight:10}}>Accept</button>
					<button className='red-btn' onClick={()=>removeFriendRequest(username)}>Reject</button>
				</div>
			</>		
		);
	}
	return (
		<>
			<div className='profile-action-buttons'>
				<button className='normal-btn' onClick={()=>sendFriendRequest(username)}>Add Friend</button>
			</div>
		</>
	);
}

export default ProfileActions;