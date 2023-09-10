import { Modal, ModalBody, ModalContent, ModalOverlay, useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import copyToClipboard from '../../utilfuncs/copyToClipboard';
import { generateTweetUrl } from '../../utilfuncs/generateTweetUrl';
import DividedList from '../utilCompos/DividedList';
import { createNamesAndMainTextAndUrl, t_activatedTweetData } from './TweetComponentList';

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

function useShowToast() {
	const toast = useToast();
	const onShowToast = useCallback((description: string) => {
		toast({
			//title: 'Account created.',
			description: description,
			status: 'success',
			duration: 1500,
			isClosable: true,
		});
	}, []);
	return { onShowToast };
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
