import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import {AppContext} from '../App';
import logo from '../images/templogo.png';
import '../css/sidebar.css';
import {AiOutlineClose} from 'react-icons/ai';

const Sidebar = ({toggleSidebar, showSidebar}) => {
	const {state:{height,width,account},logout} = useContext(AppContext);
	const [selectedTab, setSelectedTab] = useState('chats');

	const handleTabClick = (tabName) => {
		setSelectedTab(tabName);
		toggleSidebar();
	}

	return (
		<div className={(width > 768 || showSidebar) ? `sidebar sidebar-active` : `sidebar sidebar-inactive`} style={width < 768 ? {minHeight:height-100,maxHeight:'auto'} : {}}>
			<div className='sidebar-logo'>
				<img src={logo}/>
				{width < 768 && <button className='sidebar-close' type='button' onClick={toggleSidebar}><AiOutlineClose/></button>}
			</div>			
			<ul>
				<li className={selectedTab === 'chats' ? `activeSidebarItem` : ``}>
					<Link to={`/dashboard`} onClick={()=>handleTabClick('chats')}>Chats</Link>					
				</li>
				<li className={selectedTab === 'notifications' ? `activeSidebarItem` : ``}>
					<Link to={`/dashboard/notifications`} onClick={()=>handleTabClick('notifications')}>Notifications</Link>
				</li>
				<li className={selectedTab === 'myprofile' ? `activeSidebarItem` : ``}> 
					<Link to={'/dashboard/myprofile'} onClick={()=>handleTabClick('myprofile')}>My Profile</Link>					
				</li>
			</ul>
			<div className='logout'>
				<p>{account.username}</p>
				<button className='logout-btn' type='button' onClick={logout}>Log Out</button>
			</div>
		</div>
	);
}

export default Sidebar;
