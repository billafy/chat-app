import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import logo from '../images/templogo.png';
import '../css/homepage.css';
import {AppContext} from '../App';

const Homepage = () => {
	const {state:{height,width}} = useContext(AppContext);

	return (
		<section className='homepage' style={width > 768 ? {minHeight:height-200,maxHeight:'auto'} : {minHeight:height-100,maxHeight:'auto'}}>
			<div className='logo'>
				<img src={logo}/>
				<h1>ChatApp</h1>
			</div>
			<p>
				ChatApp is the easiest way to stay in touch with your friends. Talk, chat, hang out, 
				and stay close with your friends and communities.
			</p>
			<div className='links'>
				<Link to='/login'>Login</Link>
				<Link to='/createAccount'>Create Account</Link>
			</div>
			<span>Handcrafted with <span style={{color:'red',fontSize:'1.2em'}}>❤</span> by LamiFY</span>
		</section>	
	);
}

export default Homepage;