import React, {useContext} from 'react';
import {AiFillEdit} from 'react-icons/ai';

import {AppContext} from '../App';

const MyProfile = () => {
	const {state:{account}} = useContext(AppContext);

	return (
		<div className='profile'>
			<div className='profile-picture'>
				<img/>
				<h3>{account.username}</h3>
			</div>
			<div className='profile-details'>
				<p><p>Email Address</p> <span>{account.email}</span> <AiFillEdit/></p>
				<p><p>Date of Birth</p> <span>{account.dateOfBirth}</span> <AiFillEdit/></p>	
				<p><p>Gender</p> <span>{account.gender == 'M' ? 'Male' : 'Female'}</span> <AiFillEdit/></p>
				<button>Update Password</button>
				<button>Delete Account</button>			
			</div>
		</div>	
	);
}

export default MyProfile;