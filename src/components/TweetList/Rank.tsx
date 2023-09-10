import { Flex, Text } from '@chakra-ui/react';
import { FaAward } from 'react-icons/fa';
import { SIZE_TEXT_S, SIZE_TEXT_XS } from '../TweetComponent/consts';

export default function Rank(props: { rank: number }) {
	return (
		<Flex className='subText' direction={'row'} align={'center'}>
			<FaAward size={SIZE_TEXT_S} />
			<Text {...TEXT_PROPS}>{props.rank}</Text>
			<Text {...TEXT_PROPS}>位</Text>
		</Flex>
	);
}

const TEXT_PROPS = {
	fontSize: SIZE_TEXT_XS,
	fontWeight: '700',
};
