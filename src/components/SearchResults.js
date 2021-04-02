import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {BiArrowBack} from 'react-icons/bi';
import {AiFillCaretRight} from 'react-icons/ai';

import {MainContext} from './Main';
import Loading from './Loading';

import '../css/search.css';

import profilePicture from '../images/profilepicture.png';

const SearchResults = () => {
	const {state:{searchResults, searchLoading, searchAlert}} = useContext(MainContext);

	return (
		<section className='search-results'>
			<Link to='/dashboard'><BiArrowBack/></Link>
			<h4>{searchAlert}</h4>
			<div className='results-list'>
				{!searchLoading
					?
						searchResults.map((result) => {
									return (
										<div className='result-item' key={result.username}>
											<img src={profilePicture}/>
											<h4>{result.username}</h4>
											<Link to={`/dashboard/profile/${result.username}`}><AiFillCaretRight/></Link>
										</div>		
									);
								})
					:
					<Loading/>
				}				
			</div>
		</section>	
	);
}

export default SearchResults;