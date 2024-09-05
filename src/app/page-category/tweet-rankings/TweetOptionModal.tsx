import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import {
	t_dbAuthor,
	t_dbTweetDataParsed,
	t_mediaPhoto,
	t_mediaVideo,
	t_urls,
} from '../../tweet-components/inners/types';
import DividedList from '../../util-compos/DividedList';
import copyToClipboard from '../../util-funcs/copyToClipboard';
import { generateTweetUrl } from '../../util-funcs/generateTweetUrl';
import { useShowToast } from '../../util-hooks/useShowToast';
import { t_activatedTweetData } from './TweetRankings';

type p = {
	onClose: () => void;
	isOpen: boolean;
	onUnblock: (accountId: string) => void;
	onBlock: (accountId: string) => void;
} & t_activatedTweetData;
export function TweetOptionModal(props: p) {
	const { onShowToast } = useShowToast();

	return (
		<Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalBody padding={0}>
					<DividedList itemProps={generateListItemsData({ ...props, onShowToast })} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}

function generateListItemsData(props: p & { onShowToast: (description: string) => void }) {
	const twUrl = generateTweetUrl(props.authorData.screen_name, props.tweetData.tweet_id);

	const items = [
		{
			title: '元の投稿へ',
			onClick: () => window.open(twUrl),
		},
		{
			title: 'URLをコピー',
			onClick: () => {
				copyToClipboard(twUrl);
				props.onShowToast(`コピーしました:\n${twUrl}`);
			},
		},
		{
			title: '本文とURLをコピー',
			onClick: () => {
				const text = decodeHtmlEntities(
					createNamesAndMainTextAndUrl(props.authorData, props.tweetData, twUrl, props.tweetData.others.medias ?? []),
				);
				copyToClipboard(text);
				props.onShowToast(`コピーしました:\n${text}`);
			},
		},
		props.isBlockedAccount
			? {
					title: 'この投稿者の非表示を解除',
					description: decodeHtmlEntities(`${props.authorData.name}@${props.authorData.screen_name}`),
					onClick: () => props.onUnblock(props.authorData.account_id),
			  }
			: {
					title: 'この投稿者の投稿を非表示',
					description: decodeHtmlEntities(`${props.authorData.name}@${props.authorData.screen_name}`),
					onClick: () => props.onBlock(props.authorData.account_id),
			  },
	].map((e) => ({ ...e, onClick: mergeOnClose(e.onClick, props.onClose) }));
	return items;
}
const mergeOnClose = (call: Function, onClose: () => void) => () => {
	call();
	onClose();
};
const decodeHtmlEntities = (text: string) =>
	new DOMParser().parseFromString(text, 'text/html').documentElement.textContent ?? '';

const createOriginalMainText = (text: string, urls: t_urls[]): string => {
	return urls
		.reduce((accumulator, currentValue) => {
			const reg = new RegExp(currentValue.url, 'g');
			return accumulator.replace(reg, currentValue.expanded_url);
		}, text)
		.replace(/(https:\/\/t\.co\/\w+)/g, '');
};
const createNamesAndMainTextAndUrl = (
	authorData: t_dbAuthor,
	tweetData: t_dbTweetDataParsed,
	url: string,
	medias: (t_mediaPhoto | t_mediaVideo)[],
): string => {
	const mediaUrls = medias.map((e) => (e.type === 'photo' ? e.url : e.video_url)).join('\n');
	const mainText = createOriginalMainText(tweetData.text, tweetData.others.urls ?? []);
	return [`${authorData.name}@${authorData.screen_name}`, mainText, mediaUrls, url].join('\n');
};
