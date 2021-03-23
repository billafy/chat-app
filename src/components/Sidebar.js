import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import {AppContext} from '../App';
import logo from '../images/templogo.png';
import '../css/sidebar.css';
import {AiOutlineClose} from 'react-icons/ai';

const Sidebar = ({toggleSidebar, showSidebar}) => {
	const {state:{height,width},logout} = useContext(AppContext);
	const [selectedTab, setSelectedTab] = useState('chats');

	const handleTabClick = (tabName) => {
		setSelectedTab(tabName);
		toggleSidebar();
	}

	return (
		<div className={(width > 568 || showSidebar) ? `sidebar sidebar-active` : `sidebar sidebar-inactive`} style={width < 568 ? {minHeight:height-100,maxHeight:'auto'} : {}}>
			<div className='sidebar-logo'>
				<img src={logo}/>
				{width < 568 && <button className='sidebar-close' type='button' onClick={toggleSidebar}><AiOutlineClose/></button>}
			</div>			
			<ul>
				<li className={selectedTab === 'chats' && `activeSidebarItem`}>
					<Link to={`/dashboard`} onClick={()=>handleTabClick('chats')}>Chats</Link>					
				</li>
				<li className={selectedTab === 'notifications' && `activeSidebarItem`}>
					<Link to={`/dashboard/notifications`} onClick={()=>handleTabClick('notifications')}>Notifications</Link>
				</li>
				<li className={selectedTab === 'myprofile' && `activeSidebarItem`}> 
					<Link to={'/dashboard/myprofile'} onClick={()=>handleTabClick('myprofile')}>My Profile</Link>					
				</li>
			</ul>
			<button className='logout-btn' type='button' onClick={logout}>Log Out</button>
		</div>
	);
}

export default Sidebar;
