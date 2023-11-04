import { Flex, Text } from '@chakra-ui/react';
import { SIZE_TEXT_XS } from '../tweetComponents/consts';

export default function Score(props: { score: number }) {
	return (
		<Flex className='subText' direction={'row'}>
			<Text fontSize={`${SIZE_TEXT_XS}px`}>{Math.floor(props.score)}</Text>
			<Text fontSize={`${SIZE_TEXT_XS}px`} marginLeft={'2px'}>
				pt
			</Text>
		</Flex>
	);
}
