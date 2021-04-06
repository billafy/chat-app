import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {AiOutlineReload} from 'react-icons/ai';

import {MainContext} from './Main';

import '../css/notifications.css';

const Notifications = () => {
	const [reloadClass, setReloadClass] = useState('reload');
	const {state:{friendRequestsReceived}, acceptFriendRequest, removeFriendRequest, getFriendRequestsReceived} = useContext(MainContext);

	useEffect(() => {
		reloadNotifications();
	}, []);

	const reloadNotifications = () => {
		setReloadClass('reload reload-spin');
		getFriendRequestsReceived()
		.then(() => {
			setReloadClass('reload');
		});
	}

	return (
		<section className='notifications'>
			<h1>Notifications</h1>
			{friendRequestsReceived &&
				friendRequestsReceived.length === 0
				?
					<h4>You are all caught up, there are no unread notifications</h4>
				:
					<>
						{friendRequestsReceived.map(request => {
							return (
								<div className='notification' key={request.id}>
									<p>{request.sender} has sent you a friend request</p>
									<button className='green-btn' onClick={()=>acceptFriendRequest(request.sender)}>
										Accept
									</button>
									<button className='red-btn' onClick={()=>removeFriendRequest(request.sender)}>
										Reject
									</button>
									<Link to={`/dashboard/profile/${request.sender}`}>
										Go to Profile
									</Link>							
								</div>				
							);
						})}
					</>
			}
			<button className={reloadClass} type='button' onClick={reloadNotifications}><AiOutlineReload/></button>			
		</section>	
	);
}

export default Notifications;