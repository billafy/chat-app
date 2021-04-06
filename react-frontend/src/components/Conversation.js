import React, {useState, useEffect, useRef, useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import {BiSend, BiArrowBack} from 'react-icons/bi';
import {AiOutlineInfoCircle} from 'react-icons/ai';

import Loading from './Loading';

import {MainContext} from './Main';
import {urls} from '../urls';
import {AppContext} from '../App';

import '../css/conversation.css';
import profilePicture from '../images/profilepicture.png';

const Conversation = () => {
	const [messageInput, setMessageInput] = useState('');
	const {id, username} = useParams();
	const {state:{messages, conversation}, sendMessage, selectConversation} = useContext(MainContext);
	const {state:{account, token, height, width}} = useContext(AppContext);
	const screenScroll = useRef(null);

	const getConversation = async () => {
		const url = urls.getConversation + id + '/';
		const response = await fetch(url, {
			headers: {
				Authorization: 'Token '+token
			}
		});
		const data = await response.json();
		return data;
	}

	const handleSend = (event) => {
		event.preventDefault();
		const message = messageInput.trim();
		if(!message)
			return;
		sendMessage(id, username, message)
		.then(sentMessage => {
			selectConversation([...conversation, sentMessage]);
			scrollToBottom();
		});
		setMessageInput('');
	}

	const scrollToBottom = () => {
		screenScroll.current.scrollTop = screenScroll.current.scrollHeight;
	}

	useEffect(() => {
		if(!messages) {
			getConversation()
			.then(data => selectConversation(data));
		}
		else {
			const newConversation = messages.filter(message => Number(message.friendshipId)===Number(id));
			selectConversation(newConversation);
		};
	}, [])

	useEffect(() => {
		const conversationFetcher = setInterval(() => {
			getConversation()
			.then(data => selectConversation(data));
		}, 2000);
		return () => clearInterval(conversationFetcher);
	}, [])

	useEffect(() => {
		for(let i=0;i<3;++i) {
			setTimeout(() => {
				scrollToBottom();
			}, 100);
		}
	}, [])

	return (
		<section className='conversation'>
			<div className='avatar'>
				<Link to='/dashboard'><BiArrowBack/></Link>
				<img src={profilePicture}/>
				<p>{username}</p>
				<Link to={`/dashboard/profile/${username}`}><AiOutlineInfoCircle/></Link>
			</div>			
			<div className='texts' style={width > 768 ? {height:height-455} : {height:height-355}} ref={screenScroll}>
				{conversation
					?
						conversation.map(text => {
							return (
									text.sender === account.username
									?
										<div className='text text-sent' key={text.id}>
											<p>{text.text}</p>
										</div>
									:
										<div className='text text-received' key={text.id}>
											<p>{text.text}</p>
										</div>
							);
						})
					:
						<Loading/>
				}
			</div>
			<form className='send-message'>
				<input type='text' value={messageInput} onChange={(event)=>setMessageInput(event.target.value)}/>
				<button type='submit' onClick={handleSend}><BiSend/></button>
			</form>
		</section>			
	);
}

export default Conversation;