import { Link, Route, Routes } from 'react-router-dom';

import '../../App.css';
import PageSmash from '../categories/smash/page';

export default function PageHome() {
	//console.log({ PUBLIC_URL: process.env.PUBLIC_URL });
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
			<Link to={'/smash'}>スマブラ</Link>
		</div>
	);
}
