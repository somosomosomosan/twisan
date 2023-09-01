import { Box, Button, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import { differenceInCalendarDays } from 'date-fns';
import * as Rb from 'rambda';
import { useCallback, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import * as Re from 'remeda';
import { useDebouncedCallback } from 'use-debounce';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { t_storagedData } from '../../app/categories/smash/page';
import { flattenUniq, uniqForShortArray } from '../../utilfuncs/array';
import copyToClipboard from '../../utilfuncs/copyToClipboard';
import { generateTweetUrl } from '../../utilfuncs/generateTweetUrl';
import { addReadsToStorage, saveBlockedAccounts } from '../../utilfuncs/localStorages';
import { intoYyyy_mm_dd, parseYyyy_mm_dd, t_reads } from '../../utilfuncs/reads';
import {
	t_dbAuthor,
	t_dbTweetDataParsed,
	t_dbTweetScores,
	t_mediaPhoto,
	t_mediaVideo,
	t_onImageGallery,
	t_urls,
} from '../TweetComponent/types';
import DividedList from '../utilCompos/DividedList';
import TweetListItem from './TweetListItem';
import { t_blockedAccount } from './types';

type t_lightboxImage =
	| { type: 'image'; src: string }
	| { type: 'video'; poster?: string; sources: { src: string; type: 'video/mp4' }[] };
export type t_activatedTweetData = {
	authorData: t_dbAuthor;
	tweetData: t_dbTweetDataParsed;
	isBlockedAccount: boolean;
};

export default function TweetComponentList(
	props: t_storagedData & { categoryName: string; today: Date; collapseRead: boolean },
) {
	//InfiniteScrollリストページのindex
	const ref_listPageIndex = useRef<number>(1);
	//lightboxのslide用
	const ref_slides = useRef<t_lightboxImage[]>([]);
	//今日のreads
	const ref_todaysReads = useRef<t_reads>(
		props.readTweets.find((e) => {
			const d = parseYyyy_mm_dd(e.yyyy_mm_dd);
			return differenceInCalendarDays(props.today, d) === 0;
		}) ?? { yyyy_mm_dd: intoYyyy_mm_dd(props.today), tweet_ids: [] },
	);
	//InfiniteScrollのinitialLoadをtrueにすると最初に同じページを2度読み込んでしまう不具合が起きる。なのでfalseにし、初期値で0ページ目をセットする。
	const [state_listScores, set_listScores] = useState<t_dbTweetScores[]>(props.chunkedScores[0]);
	//lightboxの開閉
	const [state_lightboxOpen, set_lightboxOpen] = useState<boolean>(false);
	//lightboxのslideで最初に開く画像index
	const [state_slideInitIndex, set_slideInitIndex] = useState<number>(0);
	//InfiniteScrollリストの次のページがあるかどうか
	const [state_hasMoreListScores, set_hasMoreListScores] = useState<boolean>(true);
	//ツイートオプションモーダルに渡すツイートデータ
	const [state_activatedTweetData, set_activatedTweetData] = useState<t_activatedTweetData>();
	//折り畳まれていたものを展開したツイート
	const [state_reexpandedTweets, set_reexpandedTweets] = useState<string[]>([]);
	const [state_blockedAccounts, set_blockedAccounts] = useState<t_blockedAccount[]>(props.blockedAccounts);

	//モーダル関連
	const { isOpen: isOpenTwOption, onOpen: onOpenTwOption, onClose: onCloseTwOption } = useDisclosure();
	//ツイートオプションを開く
	const call_onOpenTwOption = useCallback((data: t_activatedTweetData) => {
		set_activatedTweetData(data);
		onOpenTwOption();
	}, []);
	//lightboxに画像をセットし開く
	const call_setImagesAndOpenLightbox: t_onImageGallery = useCallback((data, index) => {
		ref_slides.current = data.map((e) => {
			return e.type === 'image'
				? { type: 'image', src: e.src }
				: { type: 'video', poster: e.video_poster_url, sources: [{ src: e.src, type: 'video/mp4' }] };
		});
		set_slideInitIndex(index);
		set_lightboxOpen(true);
	}, []);
	//InfiniteScrollの次のページを読み込む
	const call_loadNextPage = useCallback(() => {
		if (ref_listPageIndex.current >= props.chunkedScores.length) {
			set_hasMoreListScores(false);
			return;
		}
		set_listScores((e) => [...e, ...props.chunkedScores[ref_listPageIndex.current]]);
		ref_listPageIndex.current = ref_listPageIndex.current + 1;
	}, []);

	const call_getAuthorData = useCallback((authorId: string) => getAuthorData(props.authors, authorId), [props.authors]);
	const call_getTweetData = useCallback((tweetId: string) => getTweetData(props.tweets, tweetId), [props.tweets]);
	//既読ツイートIDを取得
	const getReadTweetIds = (): string[] => {
		return Re.pipe(
			[...props.readTweets, ref_todaysReads.current],
			Rb.map((e) => e.tweet_ids),
			flattenUniq,
		);
	};
	//今日の既読を追加。そして保存。
	const call_addTodayReads = useCallback((tweetId: string) => {
		//とりあえず追加していく。高速で何度も呼ばれることがあるので重たい処理（重複除去）は保存時にだけやる。
		ref_todaysReads.current = {
			...ref_todaysReads.current,
			tweet_ids: [...ref_todaysReads.current.tweet_ids, tweetId],
		};
		//保存
		saveTodaysReadsDebounce(ref_todaysReads.current);
	}, []);
	//渡された既読を保存。debounceで。
	const saveTodaysReadsDebounce = useDebouncedCallback(
		// function
		(reads: t_reads) => {
			addReadsToStorage(props.categoryName, {
				...reads,
				tweet_ids: uniqForShortArray(reads.tweet_ids),
			});
		},
		// delay in ms
		2000,
	);
	//非表示を再展開
	const call_onReexpand = useCallback((tweetId: string) => {
		set_reexpandedTweets((e) => uniqForShortArray([...e, tweetId]));
	}, []);
	//指定投稿者のツイートのreexpandedをリセットする NG処理からのみ呼ばれる
	const resetReexpandedTheAuthorsTweets = (accountId: string) => {
		const authorsTweets = props.tweets.filter((e) => e.author_id === accountId);
		set_reexpandedTweets((reexTwIds) =>
			reexTwIds.filter((reexTwId) =>
				authorsTweets.find((authorsTweet) => authorsTweet.tweet_id === reexTwId) ? false : true,
			),
		);
	};
	//NGアカウントを追加。localstorage更新。
	const call_onBlock = useCallback((accountId: string) => {
		set_blockedAccounts((e) => {
			//これをしないと再展開したのをブロック解除→再ブロックしたときに展開されっぱなしになる（大した問題ではないが）
			resetReexpandedTheAuthorsTweets(accountId);
			//重複は除去
			const blockeds = Rb.uniqBy(Rb.prop('account_id'), [...e, getAuthorData(props.authors, accountId)]);
			//保存
			saveBlockedAccounts(props.categoryName, blockeds);
			return blockeds;
		});
	}, []);
	//NGアカウントを解除。localstorage更新。
	const call_onUnblock = useCallback((accountId: string) => {
		set_blockedAccounts((e) => {
			const blockeds = e.filter((e) => e.account_id !== accountId);
			//保存
			saveBlockedAccounts(props.categoryName, blockeds);
			return blockeds;
		});
	}, []);

	return (
		<Box>
			<Lightbox
				plugins={[Video, Zoom]}
				open={state_lightboxOpen}
				close={() => set_lightboxOpen(false)}
				index={state_slideInitIndex}
				slides={ref_slides.current}
				carousel={{ finite: true }}
				controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
			/>
			{state_activatedTweetData && (
				<TweetOptionModal
					isOpen={isOpenTwOption}
					onClose={onCloseTwOption}
					onBlock={call_onBlock}
					onUnblock={call_onUnblock}
					{...state_activatedTweetData}
				/>
			)}
			<InfiniteScroll
				loadMore={call_loadNextPage} //項目を読み込む際に処理するコールバック関数
				hasMore={state_hasMoreListScores} //読み込みを行うかどうかの判定
				loader={<LoadingComponent key={'loader'} onLoad={call_loadNextPage} />} //読み込み最中に表示する項目
				initialLoad={false}
				threshold={500}
			>
				{state_listScores.map((e, i) => {
					//NG・既読はここで予め判定しておく。ListItemの方でそれらを参照させる方式だと、どこかのそれに変更があったら全てのListItemが再描画されるようになってしまう。
					const data = buildRankedTweetData(
						e,
						props.authors,
						props.tweets,
						state_blockedAccounts,
						props.collapseRead ? getReadTweetIds() : [],
						state_reexpandedTweets,
					);
					return (
						<TweetListItem
							tweetViewStyleMode={props.tweetViewStyleMode}
							key={i}
							score={data.score}
							rank={i}
							authorData={data.authorData}
							tweetData={data.tweetData}
							loadAuthorData={call_getAuthorData}
							loadTweetData={call_getTweetData}
							isBlockedAccount={data.isNgAccount}
							isRead={data.isRead}
							isReexpanded={data.isReexpanded}
							onImageGallery={call_setImagesAndOpenLightbox}
							onOpenTwOption={call_onOpenTwOption}
							onViewingTweet={call_addTodayReads}
							onReexpand={call_onReexpand}
						/>
					);
				})}
			</InfiniteScroll>
		</Box>
	);
}

/**
 * ページを開いてすぐに既読を非表示にすると自動では次ページが読み込まれない
	既読を非表示にしてリストの高さが画面より小さくなるとそうなる模様
	なので次ページ読み込みボタンが必要である
 * @param props 
 * @returns 
 */
const LoadingComponent = (props: { onLoad: () => void }) => {
	return (
		<Button colorScheme='teal' onClick={props.onLoad} marginTop={4} marginBottom={4}>
			次のページ
		</Button>
	);
};

function TweetOptionModal(
	props: {
		onClose: () => void;
		isOpen: boolean;
		onUnblock: (accountId: string) => void;
		onBlock: (accountId: string) => void;
	} & t_activatedTweetData,
) {
	const toast = useToast();
	const _mergeOnClose = (call: Function) => () => {
		call();
		props.onClose();
	};
	const _decodeHtmlEntities = (text: string) =>
		new DOMParser().parseFromString(text, 'text/html').documentElement.textContent ?? '';
	const _showToast = (description: string) => {
		toast({
			//title: 'Account created.',
			description: description,
			status: 'success',
			duration: 1500,
			isClosable: true,
		});
	};
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
				_showToast(`コピーしました:\n${twUrl}`);
			},
		},
		{
			title: '本文とURLをコピー',
			onClick: () => {
				const text = _decodeHtmlEntities(
					createNamesAndMainTextAndUrl(props.authorData, props.tweetData, twUrl, props.tweetData.others.medias ?? []),
				);
				copyToClipboard(text);
				_showToast(`コピーしました:\n${text}`);
			},
		},
		props.isBlockedAccount
			? {
					title: 'この投稿者の非表示を解除',
					description: _decodeHtmlEntities(`${props.authorData.name}@${props.authorData.screen_name}`),
					onClick: () => props.onUnblock(props.authorData.account_id),
			  }
			: {
					title: 'この投稿者の投稿を非表示',
					description: _decodeHtmlEntities(`${props.authorData.name}@${props.authorData.screen_name}`),
					onClick: () => props.onBlock(props.authorData.account_id),
			  },
	].map((e) => ({ ...e, onClick: _mergeOnClose(e.onClick) }));
	return (
		<Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalBody padding={0}>
					<DividedList itemProps={items} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
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
function buildRankedTweetData(
	score: t_dbTweetScores,
	authors: t_dbAuthor[],
	tweets: t_dbTweetDataParsed[],
	ngAccounts: t_blockedAccount[],
	readTweets: string[],
	reexpandedTweets: string[],
) {
	const tweetData = getTweetData(tweets, score.tweet_id);
	return {
		score: score.score,
		authorData: getAuthorData(authors, tweetData.author_id),
		tweetData: tweetData,
		isNgAccount: isNgAccount(ngAccounts, tweetData.author_id),
		isRead: readTweets.includes(tweetData.tweet_id),
		isReexpanded: reexpandedTweets.includes(tweetData.tweet_id),
	};
}

const DUMMY_AUTHOR: t_dbAuthor = {
	account_id: '0',
	name: '?',
	profile_image_url: '',
	screen_name: '?',
	verified: false,
};
const DUMMY_TWEET: t_dbTweetDataParsed = {
	tweet_id: '0',
	author_id: '0',
	text: '?',
	created_at: '0',
	retweets: 0,
	likes: 0,
	quotes: 0,
	replies: 0,
	others: {},
};
function getAuthorData(authors: t_dbAuthor[], authorId: string): t_dbAuthor {
	return authors.find((e) => e.account_id === authorId) ?? DUMMY_AUTHOR;
}
function getTweetData(tweetData: t_dbTweetDataParsed[], tweetId: string): t_dbTweetDataParsed {
	return tweetData.find((e) => e.tweet_id === tweetId) ?? DUMMY_TWEET;
}
function isNgAccount(ngAccounts: t_blockedAccount[], authorId: string): boolean {
	return ngAccounts.find((e) => e.account_id === authorId) ? true : false;
}
