import { useCallback } from 'react';
/** @jsxImportSource @emotion/react */
import { Box, Center, Text } from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';
import { t_dbAuthor, t_dbTweetDataParsed } from './types';
export default function TweetContainerCollapsed({
	authorData,
	tweetData,
	collapsedForWhat,
	onReexpand: onOpen,
}: {
	authorData: t_dbAuthor;
	tweetData: t_dbTweetDataParsed;
	collapsedForWhat: 'BLOCKED' | 'READ';
	onReexpand: (tweetId: string) => any;
}) {
	//第2引数を設定しないと別の折り畳みがオープンされるという現象が起きた
	const _open = useCallback(
		(event: any) => {
			event.stopPropagation();
			onOpen(tweetData.tweet_id);
		},
		[tweetData],
	);

	return (
		<Box className='subText' onClick={_open}>
			<Text noOfLines={1} size={'12px'} textAlign={'left'}>
				{collapsedForWhat === 'BLOCKED' ? createReasonForBlocked(authorData.screen_name) : createReasonForRead()}
			</Text>
			<Box position={'relative'}>
				<Text noOfLines={1} size={'12px'} textAlign={'left'}>
					{tweetData.text}
				</Text>
				<Center>
					<FaChevronDown size={17} />
				</Center>
			</Box>
		</Box>
	);
}

function createReasonForBlocked(screenName: string) {
	return `[アカウント] @${screenName}`;
}
function createReasonForRead() {
	return '[既読]';
}
