import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {BiArrowBack} from 'react-icons/bi';

import {MainContext} from './Main';

const SearchResults = () => {
	const {state:{searchResults, searchLoading, searchAlert}} = useContext(MainContext);

	return (
		<section className='search-results'>
			<Link to='/dashboard'><BiArrowBack/></Link>
			<h1>{searchAlert}</h1>
			<div className='results-list'>
				{searchResults.map((result) => {
								return (
									<h1>{result.username}</h1>		
								);
							})
				}				
			</div>
		</section>	
	);
}

export default SearchResults;