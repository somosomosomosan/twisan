import { Box } from '@chakra-ui/react';
import React from 'react';
import { Tweet } from 'react-twitter-widgets';
import { PATH_ASSETS } from '../../consts';

const LOADING_ICON = `${PATH_ASSETS}/Loading_icon.gif`;

export default React.memo(EmbedTweetComponent, (prevProps, nextProps) => prevProps.tweetId === nextProps.tweetId);

function EmbedTweetComponent(props: { tweetId: string }) {
	//Tweetに読み込み完了時に実行されるonLoad関数が用意されているが何故か実行されない。なので背景画像でロード表示することに。
	return (
		<Box
			onClick={(event: any) => event.stopPropagation()}
			minHeight={'200px'}
			backgroundImage={`url(${LOADING_ICON})`}
			backgroundSize={'contain'}
			backgroundRepeat={'no-repeat'}
			backgroundPosition={'top'}
		>
			<Tweet tweetId={props.tweetId} renderError={Failed} />
		</Box>
	);
}

function Failed() {
	return <p>読み込み失敗</p>;
}
