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
	const [conversation, setConversation] = useState([]);
	const [friend, setFriend] = useState({});
	const [messageInput, setMessageInput] = useState('');
	const {id, username} = useParams();
	const {state:{friends, messages}, sendMessage, getMessages} = useContext(MainContext);
	const {state:{account, token, height, width}} = useContext(AppContext);
	const bottomScroller = useRef(null);
	const scrollScreen = useRef(null);

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

	const handleSend = () => {
		const message = messageInput.trim();
		if(!message)
			return;
		sendMessage(id, username, message)
		.then(sentMessage => setConversation([...conversation, sentMessage]));
		setMessageInput('');
	}

	useEffect(() => {
		if(!messages) {
			getConversation()
			.then(data => setConversation(data));
		}
		else {
			setConversation(() => {
				return messages.filter(message => Number(message.friendshipId)===Number(id));
			})
		};
	}, [])

	useEffect(() => {
		setInterval(() => {
			getConversation()
			.then(data => {
				if(conversation.length !== data.length)
					setConversation(data);
			});
		}, 2000);
	}, [])

	useEffect(() => {
		scrollScreen.current.scrollTop = scrollScreen.current.scrollHeight;
	}, [conversation])

	return (
		<section className='conversation'>
			<div className='avatar'>
				<Link to='/dashboard'><BiArrowBack/></Link>
				<img src={profilePicture}/>
				<p>{username}</p>
				<Link to={`/dashboard/profile/${username}`}><AiOutlineInfoCircle/></Link>
			</div>			
			<div className='texts' style={width > 768 ? {height:height-455} : {height:height-355}} ref={scrollScreen}>
				{conversation
					?
						<>
							{
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
							}
							<div style={{float:'left', clear:'both'}} ref={bottomScroller}/>
						</>
					:
						<Loading/>
				}
			</div>
			<div className='send-message'>
				<input type='text' value={messageInput} onChange={(event)=>setMessageInput(event.target.value)}/>
				<button onClick={handleSend}><BiSend/></button>
			</div>
		</section>			
	);
}

export default Conversation;