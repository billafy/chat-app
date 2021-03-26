import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {AiFillCaretDown} from 'react-icons/ai';

const ProfileActions = ({username, status}) => {
	const [showDropdown, setShowDropdown] = useState(false);

	if(status==='FRIEND') {
		return (
			<>
				<div className='profile-action-buttons'>
					<Link to={`/dashboard/conversation/${username}`}>
						<button className='normal-btn'>Message</button>
					</Link>
					<button className='red-btn'>Unfriend</button>
				</div>
			</>				
		);
	}
	else if(status==='REQUEST_SENT') {
		return (
			<>
				<p>You have sent a friend request to {username}</p>
				<div className='profile-action-buttons'>
					<button className='red-btn'>Cancel</button>
				</div>
			</>	
		);
	}
	else if(status==='REQUEST_RECEIVED') {
		return (
			<>
				<p>{username} has sent you a friend request</p>
				<div className='profile-action-buttons'>
					<button className='green-btn'>Accept</button>
					<button className='red-btn'>Reject</button>
				</div>
			</>		
		);
	}
	return (
		<>
			<div className='profile-action-buttons'>
				<button className='normal-btn'>Add Friend</button>
			</div>
		</>
	);
}

export default ProfileActions;