import React, {useState, useContext} from 'react';
import '../css/loginCreateAccount.css';
import {Link} from 'react-router-dom';
import {FaUser, FaLock} from 'react-icons/fa';
import {AppContext} from '../App';
import Loading from './Loading';
import logo from '../images/templogo.png';
import {urls} from '../urls';

const Login = () => {
	const [alert, setAlert] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [accountInput, setAccountInput] = useState({username:'',password:''});
	const {state:{height, width}, login} = useContext(AppContext);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setAlert('');
		setIsLoading(true);
		const {username, password} = accountInput;
		if(!username || !password) {
			setAlert('Please fill all the fields.');
			setIsLoading(false);
			return;
		}
        const url = urls.accountLogin;
        const response = await fetch(url, {
        	method: 'POST',
        	headers : {
        		'Content-Type': 'application/json'
        	},
        	body: JSON.stringify(accountInput)
        });
        const token = await response.json();
        if(!token) {
        	setAccountInput({username:'',password:''});
        	setAlert('Invalid username or password');
        	setIsLoading(false);
        	return;
        }
        login(username, token);
        setIsLoading(false);
	}

	return(
		<section className='account-form' style={width > 768 ? {minHeight:height-200,maxHeight:'auto'} : {minHeight:height-100,maxHeight:'auto'}}>
			<img src={logo}/>
			<h1>
				LOGIN
			</h1>
			<form>
				<div className='form-field'>
					<FaUser/>
					<input type='text' placeholder='Username' value={accountInput.username} onChange={(event)=>setAccountInput({...accountInput,username:event.target.value})}/>
				</div>
				<div className='form-field'>
					<FaLock/>
					<input type='password' placeholder='Password' value={accountInput.password} onChange={(event)=>setAccountInput({...accountInput,password:event.target.value})}/>					
				</div>
				{isLoading && <Loading/>}
				{alert && <p className='alert'>{alert}</p>}
				<button type='submit' onClick={handleSubmit}>CONFIRM</button>
			</form>
			<Link to='/createAccount'>
				Don't have an account yet? Create Account
			</Link>
		</section>	
	);
}

export default Login;