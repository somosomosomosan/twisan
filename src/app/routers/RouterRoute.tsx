import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { Helmet } from 'react-helmet-async';
import { Link, Route, Routes } from 'react-router-dom';

import '../../App.css';
import { SITE_TITLE } from '../../consts';
import PageDonation from '../page-donation/PageDonation';
import CategorySmash from './CategorySmash';

export default function RouterRoute() {
	//console.log({ PUBLIC_URL: process.env.PUBLIC_URL });
	const loc = window.location;
	useEffect(() => {
		TagManager.initialize({ gtmId: 'GTM-WGJ38LSL' });
	}, [loc]);
	/*
	useEffect(() => {
		document.body.classList?.remove('loading');
	}, []);
	*/
	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<Content />} />
				<Route path='/donation' element={<PageDonation />} />
				<Route path='/smash' element={<CategorySmash />} />
			</Routes>
		</div>
	);
}
function Content() {
	return (
		<div>
			<Helmet>
				<title>{SITE_TITLE.base}</title>
			</Helmet>
			<Link to={'/smash'}>スマブラ</Link>
		</div>
	);
}
