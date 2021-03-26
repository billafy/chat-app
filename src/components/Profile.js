import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
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
	const {getProfileStatus} = useContext(MainContext);
	const {username} = useParams();
	const [profile, setProfile] = useState({});
	const [profileLoading, setProfileLoading] = useState(true);
	const [status, setStatus] = useState('');

	useEffect(() => {
		getProfile();
	}, []);

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
		setStatus(/* getProfileStatus(username) */'FRIEND');
	}

	return (
		<div className='profile'>
			<Link to='/dashboard'><BiArrowBack/></Link>
			{!profileLoading
				?
				<>
					<div className='profile-picture'>
						<img src={profilePicture}/>
						<h3>{profile.username}</h3>
					</div>
					<div className='profile-actions'>
						<ProfileActions username={username} status={status}/>
					</div>
					<div className='profile-details'>
						<div><p>Email Address </p> <span>{profile.email}</span></div>
						<div><p>Date of Birth </p> <span>{profile.dateOfBirth}</span></div>	
						<div><p>Gender </p> <span>{profile.gender === 'M' ? 'Male' : 'Female'}</span></div>			
					</div>
				</>
				:
				<Loading/>
			}
		</div>
	);
}

export default Profile;