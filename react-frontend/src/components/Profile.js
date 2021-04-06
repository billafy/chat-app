import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {AiOutlineReload} from 'react-icons/ai';
import {BiArrowBack} from 'react-icons/bi';

import {useParams} from 'react-router-dom';

import {MainContext} from './Main';
import {AppContext} from '../App';
import {urls} from '../urls';

import ProfileActions from './ProfileActions';
import Loading from './Loading';

import '../css/profile.css';
import profilePicture from '../images/profilepicture.png';

const Profile = () => {
	const {state:{token}} = useContext(AppContext);
	const {state:{friends}, getProfileStatus, getFriends, getFriendRequestsReceived, getFriendRequestsSent} = useContext(MainContext);
	const {username} = useParams();
	const [profile, setProfile] = useState({});
	const [profileLoading, setProfileLoading] = useState(true);
	const [status, setStatus] = useState('');
	const [reloadClass, setReloadClass] = useState('reload');
	const [friend, setFriend] = useState({});
 
	useEffect(() => {
		const newFriend = friends.filter(friend => (friend.user1===username || friend.user2===username));
		setFriend(newFriend && newFriend[0]);
		getProfile();
		reloadFriendsAndRequests();
	}, [status]);

	useEffect(() => {
		getProfileStatus(username)
		.then(newStatus => {
			if(status!==newStatus)
				setStatus(newStatus);
		})
	}, [getProfileStatus])

	const getProfile = async () => {
		const url = urls.accountDetailed + username + '/';
		const response = await fetch(url, {
			headers: {
				Authorization: 'Token '+token
			}
		});
		const data = await response.json();
		setProfile(data);
		setProfileLoading(false);
	}

	const reloadFriendsAndRequests = () => {
		setReloadClass('reload reload-spin');
		getFriends();
		getFriendRequestsSent();
		getFriendRequestsReceived()
		.then(() => setReloadClass('reload'));
	}

	return (
		<div className='profile'>
			<div className='back-and-reload'>
				<Link to='/dashboard/search'><BiArrowBack/></Link>
				<div>
					<button onClick={reloadFriendsAndRequests} className={reloadClass}><AiOutlineReload/></button>
				</div>
			</div>
			{!profileLoading
				?
				<>
					<div className='profile-picture'>
						<img src={profilePicture}/>
						<h3>{profile.username}</h3>
					</div>
					<div className='profile-actions'>
						<ProfileActions username={username} status={status} friend={friend}/>
					</div>
					{status === 'FRIEND'
						&&
						<div className='profile-details'>
							<div><p>Email Address </p> <span>{profile.email}</span></div>
							<div><p>Date of Birth </p> <span>{profile.dateOfBirth}</span></div>	
							<div><p>Gender </p> <span>{profile.gender === 'M' ? 'Male' : 'Female'}</span></div>			
						</div>
					}
				</>
				:
				<Loading/>
			}
		</div>
	);
}

export default Profile;