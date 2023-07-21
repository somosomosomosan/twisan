import { Link } from 'react-router-dom';
import TweetComponentList from '../../../components/TweetList/TweetComponentList';
import twtsJson from '../../../data/smash/mock.json';
import { t_dbAuthor, t_dbTweetDataParsed, t_dbTweetScores } from '../../../components/TweetComponent/types';

export default function PageSmash() {
	const data = twtsJson as { scores: t_dbTweetScores[]; tweets: t_dbTweetDataParsed[]; authors: t_dbAuthor[] };
	return (
		<div>
			<p>すまぶら</p>
			<Link to={'/'}>ホーム</Link>
			<TweetComponentList {...data} ngAccounts={[]} readTweets={[]} />
		</div>
	);
}
