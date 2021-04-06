import React, {useState, useContext} from 'react';
import '../css/loginCreateAccount.css';
import {Link} from 'react-router-dom';
import {FaUser, FaLock, FaGenderless} from 'react-icons/fa';
import {MdMail, MdCake} from 'react-icons/md';
import {AppContext} from '../App';
import logo from '../images/templogo.png';
import Loading from './Loading';
import {hasAlpha, isAlphaNumeric, validateDate} from '../utils';
import {urls} from '../urls';

const CreateAccount = () => {
	const [accountInput, setAccountInput] = useState({username:'',password:'',email:'',gender:'M',dateOfBirth:''});
	const {login} = useContext(AppContext);
	const [alert, setAlert] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setAlert('');
		setIsLoading(true);
		let {username, password, email, gender, dateOfBirth} = accountInput;
		username = username.trim();
		password = password.trim();
		email = email.trim();
		if(!username || !password || !email || !gender || !dateOfBirth) {
			setAlert('Please fill all the fields.');
			setIsLoading(false);
			return;
		}
		// Username Validation
		if(username.length<6 || username.length>32) {
			setAlert('Username should contain 6 to 32 characters');
			setAccountInput({...accountInput,username:''});
			setIsLoading(false);
			return;
		}
		if(!hasAlpha(username)) {
			setAlert('Username should atleast contain 1 alphabet');
			setAccountInput({...accountInput,username:''});
			setIsLoading(false);
			return;
		}
		// Password Validation
		if(password.length<6 || password.length>32) {
			setAlert('Password should contain 6 to 32 characters');
			setAccountInput({...accountInput,password:''});
			setIsLoading(false);
			return;
		}
		if(!isAlphaNumeric(password)) {
			setAlert('Password should be alphanumeric');
			setAccountInput({...accountInput,password:''});
			setIsLoading(false);
			return;
		}
		// Email Validation
		const url = urls.validateEmail;
		let response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({email:email})
		});
		const isValid = await response.json();
		if(!isValid) {
			setAlert('Invalid email address');
			setAccountInput({...accountInput,email:''});
			setIsLoading(false);
			return;
		}
		// DateOfBirth Validation
		const dateStatus = validateDate(dateOfBirth);
		if(dateStatus==='INVALID') {
			setAlert('Invalid date of birth');
			setAccountInput({...accountInput,dateOfBirth:''})
			setIsLoading(false);
			return;
		}
		if(dateStatus==='UNDER3') {
			setAlert('User should be older than 3 years');
			setAccountInput({...accountInput,dateOfBirth:''})
			setIsLoading(false);
			return;
		}
		// API request for creating the account
		response = await fetch(urls.accountCreate, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(accountInput)
		});
		const token = await response.json();
		if(token===false) {
			setAlert('Username or email address already registered');
			setAccountInput({username:'',password:'',email:'',gender:'M',dateOfBirth:''});
			setIsLoading(false);
			return;
		}
		login(username, token);
	}

	const handleInput = (value, field) => {
		if(value[value.length-1]===' ')
			return;
		if(field==='username')
			setAccountInput({...accountInput, username:value}); 
		else if(field==='password')
			setAccountInput({...accountInput, password:value});
		else if(field==='email')
			setAccountInput({...accountInput, email:value});
	}

	return(
		<section className='account-form'>
			<img src={logo}/>
			<h1>
				CREATE ACCOUNT
			</h1>
			<form>
				<div className='form-field'>
					<FaUser/>
					<input type='text' placeholder='Username' value={accountInput.username} onChange={(event)=>handleInput(event.target.value,'username')}/>
				</div>
				<div className='form-field'>
					<FaLock/>
					<input type='password' placeholder='Password' value={accountInput.password} onChange={(event)=>handleInput(event.target.value,'password')}/>					
				</div>
				<div className='form-field'>
					<MdMail/>
					<input type='text' placeholder='Email Address' value={accountInput.email} onChange={(event)=>handleInput(event.target.value,'email')}/>
				</div>
				<div className='form-field'>
					<FaGenderless/>
					<select value={accountInput.gender} onChange={(event)=>setAccountInput({...accountInput,gender:event.target.value})}>
						<option value='M'>Male</option>
						<option value='F'>Female</option>
						<option value='O'>Other</option>
					</select>					
				</div>
				<div className='form-field'>
					<MdCake/>
					<input type='date' value={accountInput.dateOfBirth} onChange={(event)=>setAccountInput({...accountInput,dateOfBirth:event.target.value})}></input>				
				</div>
				{isLoading && <Loading/>}
				{alert && <p className='alert'>{alert}</p>}
				<button type='submit' onClick={handleSubmit}>CONFIRM</button>
			</form>
			<Link to='/login'>
				Already have an account? Login
			</Link>
		</section>	
	);
}

export default CreateAccount;