import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { AiOutlineHeart, AiOutlineRetweet } from 'react-icons/ai';
import { VscComment } from 'react-icons/vsc';
import { SIZE_TEXT_M, SIZE_TEXT_S } from './consts';

type P_publicMetrics = {
	likes: number;
	retweets: number;
	quotes: number;
	replies: number;
};
/**
 * Likes, Retweets, Quotes, Replies。
 * RTとQuoteは併せて数えることにする。本家埋め込みはそうしてるし、それはQuoteを置くスペースが無いから。
 */
export default function PublicMetrics(props: P_publicMetrics) {
	return (
		<Flex direction={'row'} wrap={'nowrap'} paddingBottom={'4px'}>
			<Replies count={props.replies} />
			<Retweets count={props.retweets + props.quotes} />
			<Likes count={props.likes} />
		</Flex>
	);
}

type P = {
	count: number;
};

const Likes = (props: P) => (
	<Base count={props.count}>
		<AiOutlineHeart size={SIZE_TEXT_M} />
	</Base>
);
const Retweets = (props: P) => (
	<Base count={props.count}>
		<AiOutlineRetweet size={SIZE_TEXT_M} />
	</Base>
);
const Replies = (props: P) => (
	<Base count={props.count}>
		<VscComment size={SIZE_TEXT_M} />
	</Base>
);

type P_base = P & {
	children: React.ReactNode;
};
const Base = (props: P_base) => {
	const count = valueFloor(props.count);
	return (
		<Flex className='subText' direction={'row'} marginRight={4} alignItems={'baseline'}>
			<Flex direction={'row'} alignItems={'baseline'} width={'24px'} height={'32px'} position={'relative'} top={'2px'}>
				{props.children}
			</Flex>
			<Box as={'span'} fontSize={`${SIZE_TEXT_S}px`} marginLeft={'4px'}>
				{count}
			</Box>
		</Flex>
	);
};

/**
 * たとえば123456なら12.3万
 * @param value
 * @returns
 */
const valueFloor = (value: number) => {
	if (value >= 10000) {
		return Math.floor((value / 10000) * Math.pow(10, 1)) / Math.pow(10, 1) + '万';
	}
	return value;
};
