import * as React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import PageSmash from '../categories/smash/page';
import logo from '../../logo.svg';
import '../../App.css';

export default function PageHome() {
	console.log({ PUBLIC_URL: process.env.PUBLIC_URL });
	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<Content />} />
				<Route path='/smash' element={<PageSmash />} />
			</Routes>
		</div>
	);
}
function Content() {
	return (
		<div>
			<Link to={'/smash'}>スマブラaa</Link>
			<img src={logo} className='App-logo' alt='logo' />
		</div>
	);
}
