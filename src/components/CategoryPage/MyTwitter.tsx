import { Link } from '@chakra-ui/react';
import { COLOR_LINK } from '../tweetComponents/consts';

export function MyTwitter() {
	return (
		<Link color={COLOR_LINK} href={'https://x.com/twicrbot_ssbu'} target={'_blank'}>
			運営者Twitter
		</Link>
	);
}
