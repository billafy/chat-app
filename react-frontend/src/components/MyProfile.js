import React, {useState, useContext} from 'react';

import {AppContext} from '../App';

import Loading from './Loading';

import '../css/profile.css';
import profilePicture from '../images/profilepicture.png';
import {isAlphaNumeric} from '../utils';
import {urls} from '../urls';

const MyProfile = () => {
	const {state:{account, token}, newToken, logout} = useContext(AppContext);
	const [updatingPassword, setUpdatingPassword] = useState(false);
	const [deletingAccount, setDeletingAccount] = useState(false);
	const [passwords, setPasswords] = useState({oldPassword:'',newPassword:''});
	const [alert, setAlert] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const handlePasswordSubmit = async () => {
		setAlert('');
		setIsLoading(true);
		const {oldPassword, newPassword} = passwords;
		if(!oldPassword || !newPassword) {
			setAlert('Please fill all the fields');
			setIsLoading(false);
			return;
		}
		if(oldPassword.length < 6 || oldPassword.length > 32 || newPassword.length < 6 || newPassword.length > 32) {
			setAlert('Password should contain 6 to 32 characters');
			setIsLoading(false);
			return;
		}
		if(oldPassword === newPassword) {
			setAlert('New password should not match the old password');
			setIsLoading(false);
			return;
		}
		if(!isAlphaNumeric(oldPassword) || !isAlphaNumeric(newPassword)) {
			setAlert('Password should be alphanumeric');
			setIsLoading(false);
			return;
		}
		const url = urls.passwordUpdate + account.username + '/';
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type':'application/json',
				Authorization: 'Token '+token
			},
			body: JSON.stringify(passwords)
		});
		const updated = await response.json();
		if(!updated) {
			setAlert('Incorrect old password');
			setIsLoading(false);
			return;
		}
		newToken(updated);
		setAlert('Password successfully updated');
		setPasswords({oldPassword:'',newPassword:''});
		setIsLoading(false);
	}

	const deleteAccount = async () => {
		setDeleteLoading(true);
		const url = urls.accountDelete + account.username + '/';
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: 'Token '+token
			}
		});
		const deleted = await response.json();
		if(deleted)
			logout();
	}	

	const handleInput = (input, field) => {
		setAlert('');
		if(input[input.length-1]===' ')
			return;
		if(field==='old')
			setPasswords({...passwords,oldPassword:input});
		else if(field==='new')
			setPasswords({...passwords,newPassword:input});
	}	

	return (
		<div className='profile'>
			<h1>My Profile</h1>
			<div className='profile-picture'>
				<img src={profilePicture}/>
				<h3>{account.username}</h3>
			</div>
			<div className='profile-details'>
				<div><p>Email Address </p> <span>{account.email}</span></div>
				<div><p>Date of Birth </p> <span>{account.dateOfBirth}</span></div>	
				<div><p>Gender </p> <span>{account.gender === 'M' ? 'Male' : 'Female'}</span></div>			
			</div>
			<div className='profile-sensitive'>
				<button className='profile-btn init-upd-pwd' onClick={()=>setUpdatingPassword(true)}>Update Password</button>
				{updatingPassword && 
					<div className='password-update'>
						<div>
							<label>Old Password</label><input type='password' value={passwords.oldPassword} onChange={(event)=>handleInput(event.target.value,'old')}/>
						</div>
						<div>
							<label>New Password</label><input type='password' value={passwords.newPassword} onChange={(event)=>handleInput(event.target.value,'new')}/>
						</div>
						{alert && <p>{alert}</p>}
						{isLoading && <Loading/>}
						<button onClick={handlePasswordSubmit}>Confirm</button>
						<button onClick={()=>setUpdatingPassword(false)}>Cancel</button>
					</div>
				}
				<br/>
				<button className='profile-btn init-del-acc' onClick={()=>setDeletingAccount(true)}>Delete Account</button>
				{deletingAccount &&
					<div className='account-delete'>
						<p>Are you sure you want to delete your account?</p>
						{deleteLoading && <Loading/>}
						<button onClick={deleteAccount}>Confirm</button> 
						<button onClick={()=>setDeletingAccount(false)}>Cancel</button>
					</div>
				}
			</div>
		</div>	
	);
}

export default MyProfile;