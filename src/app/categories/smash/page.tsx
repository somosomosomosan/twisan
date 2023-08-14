import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Hide,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Stack,
	Text,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import * as Rb from 'rambda';
import { Suspense, useState } from 'react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { PiGearFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { COLOR_BORDER } from '../../../components/TweetComponent/consts';
import { t_dbAuthor, t_dbTweetDataParsed, t_dbTweetScores } from '../../../components/TweetComponent/types';
import TweetComponentList from '../../../components/TweetList/TweetComponentList';
import { t_tweetViewStyleMode } from '../../../components/TweetList/TweetListItem';
import { t_blockedAccount } from '../../../components/TweetList/types';
import DividedList from '../../../components/utilCompos/DividedList';
import { READS_SAVE_DAYS } from '../../../consts';
import { getRankingData } from '../../../utilfuncs/getRankingData';
import {
	loadBlockedAccountsFromStorage,
	loadReadsFromStorage,
	loadTweetViewStyleMode,
	saveReadsToStorage,
	saveTweetViewStyleMode,
} from '../../../utilfuncs/localStorages';
import { removeReadsNDaysBeforeThenSave, t_reads } from '../../../utilfuncs/reads';

const CATEGORY_NAME = 'smash';
export default function PageSmash() {
	return (
		<div>
			<Container maxW='100%' centerContent marginTop={4} marginBottom={4}>
				<VStack spacing={4} align='stretch'>
					<Heading as='h1' size='lg' noOfLines={1}>
						Title: スマブラ
					</Heading>
					<Text size='sm'>スマブラアカウントの間で最近話題の投稿</Text>
				</VStack>
			</Container>
			<Suspense fallback={<div>Loading...</div>}>
				<LoaderWrapper />
			</Suspense>
		</div>
	);
}
/*
				<>
					<Show above='sm'>
						<Box>This text appears at the "sm" value screen width or greater.</Box>
					</Show>
					<Hide below='md'>
						<Box>This text hides at the "md" value screen width and smaller.</Box>
					</Hide>
				</>
*/

export type t_storagedData = {
	tweetViewStyleMode: t_tweetViewStyleMode;
	chunkedScores: t_dbTweetScores[][];
	tweets: t_dbTweetDataParsed[];
	authors: t_dbAuthor[];
	blockedAccounts: t_blockedAccount[];
	readTweets: t_reads[];
};
function LoaderWrapper() {
	const today = new Date();
	const { data } = useQuery({
		queryKey: [CATEGORY_NAME],
		queryFn: () => getRankingData(CATEGORY_NAME),
	});
	const readTweets = setupReads(CATEGORY_NAME, today);
	const blockedAccounts = loadBlockedAccountsFromStorage(CATEGORY_NAME);
	const tweetViewStyleMode = loadTweetViewStyleMode();
	return (
		<Content
			tweetViewStyleMode={tweetViewStyleMode}
			scores={data?.scores ?? []}
			tweets={data?.tweets ?? []}
			authors={data?.authors ?? []}
			blockedAccounts={blockedAccounts}
			readTweets={readTweets}
			today={today}
		/>
	);
}

function chunkScore(scores: t_dbTweetScores[], tweetViewStyleMode: t_tweetViewStyleMode) {
	if (tweetViewStyleMode === 'EMBED') {
		return Rb.splitEvery(3, scores);
	}
	return Rb.splitEvery(5, scores);
}

function Content(props: Omit<t_storagedData, 'chunkedScores'> & { scores: t_dbTweetScores[]; today: Date }) {
	const [state_collapseRead, set_collapseRead] = useState<boolean>(false);
	const [state_tweetViewStyleMode, set_tweetViewStyleMode] = useState<t_tweetViewStyleMode>(props.tweetViewStyleMode);
	const [state_chunkedScores, set_chunkedScores] = useState<t_dbTweetScores[][]>(
		chunkScore(props.scores, props.tweetViewStyleMode),
	);
	/*
	おそらくinfinite scrollの方でstateを保持し続けてるためここで途中で変更しても変わらない
	ページ再読み込みさせるしか
	useEffect(() => {
		set_chunkedScores(chunkScore(props.scores, state_tweetViewStyleMode));
	}, [props.scores, state_tweetViewStyleMode]);
	*/

	return (
		<Box>
			<Container maxW='100%' centerContent marginBottom={8}>
				<Hide below='lg'>
					<OptionsForPc
						isCollapseRead={state_collapseRead}
						onChangeCollapseMode={() => set_collapseRead((e) => !e)}
						tweetViewStyleMode={state_tweetViewStyleMode}
						onChangeTweetViewStyleMode={(e) => {
							//set_tweetViewStyleMode(e);
							saveTweetViewStyleMode(e);
							window.location.reload();
						}}
					/>
				</Hide>
				<Hide above='lg'>
					<OptionsForMobile
						isCollapseRead={state_collapseRead}
						onChangeCollapseMode={() => set_collapseRead((e) => !e)}
						tweetViewStyleMode={state_tweetViewStyleMode}
						onChangeTweetViewStyleMode={(e) => {
							//set_tweetViewStyleMode(e);
							saveTweetViewStyleMode(e);
							window.location.reload();
						}}
					/>
				</Hide>
			</Container>
			<Flex maxW='100%' flexDirection={'row'} justifyContent={'center'}>
				<Box
					//width:100%としないと画面幅がmaxWidthより小さい場合にmaxWidthまで拡大して画面幅を超えてしまう現象がおきることがある
					width={'100%'}
					maxW='598px'
					borderWidth={1}
					borderColor={COLOR_BORDER}
				>
					<Suspense fallback={<div>Loading...</div>}>
						<TweetComponentList
							{...props}
							chunkedScores={state_chunkedScores}
							tweetViewStyleMode={state_tweetViewStyleMode}
							categoryName={CATEGORY_NAME}
							collapseRead={state_collapseRead}
							today={props.today}
						/>
					</Suspense>
				</Box>
				<Hide below='lg'>
					<Box borderWidth={1} borderColor={'black'} maxW={'312px'} minW={'300px'} alignItems={'start'}>
						<Link to={'/'}>ホーム</Link>
						<Text>AD!</Text>
					</Box>
				</Hide>
			</Flex>
		</Box>
	);
}

function OptionsForPc(props: {
	isCollapseRead: boolean;
	onChangeCollapseMode: () => any;
	tweetViewStyleMode: t_tweetViewStyleMode;
	onChangeTweetViewStyleMode: (e: t_tweetViewStyleMode) => any;
}) {
	return (
		<Flex flexDirection={'column'}>
			<Stack spacing={4} direction='row' justifyContent='center' marginBottom={4}>
				<Menu>
					<MenuButton as={Button} colorScheme='teal' size={'lg'} variant='outline'>
						投稿表示設定
					</MenuButton>
					<MenuList>
						<MenuItem
							onClick={() => props.onChangeTweetViewStyleMode('CUSTOM')}
							icon={props.tweetViewStyleMode === 'CUSTOM' ? <FaCheck /> : undefined}
						>
							軽量表示
						</MenuItem>
						<MenuItem
							onClick={() => props.onChangeTweetViewStyleMode('NO_MEDIAS')}
							icon={props.tweetViewStyleMode === 'NO_MEDIAS' ? <FaCheck /> : undefined}
						>
							画像無し
						</MenuItem>
						<MenuItem
							onClick={() => props.onChangeTweetViewStyleMode('EMBED')}
							icon={props.tweetViewStyleMode === 'EMBED' ? <FaCheck /> : undefined}
						>
							埋め込み表示
						</MenuItem>
					</MenuList>
				</Menu>
				<Button variant='outline' colorScheme='teal' size='lg' onClick={props.onChangeCollapseMode}>
					{props.isCollapseRead ? '既読を表示' : '既読を非表示'}
				</Button>
				<Button variant='outline' colorScheme='teal' size='lg'>
					非表示アカウント設定
				</Button>
			</Stack>
			<Stack spacing={4} direction='row' justifyContent='center'></Stack>
		</Flex>
	);
}

function OptionsForMobile(props: {
	isCollapseRead: boolean;
	onChangeCollapseMode: () => any;
	tweetViewStyleMode: t_tweetViewStyleMode;
	onChangeTweetViewStyleMode: (e: t_tweetViewStyleMode) => any;
}) {
	return (
		<Menu>
			<MenuButton as={Button} colorScheme='teal' size={'lg'} variant='outline' rightIcon={<FaChevronDown />}>
				表示設定
			</MenuButton>

			<MenuList>
				<MenuItem
					onClick={() => props.onChangeTweetViewStyleMode('CUSTOM')}
					icon={props.tweetViewStyleMode === 'CUSTOM' ? <FaCheck /> : undefined}
				>
					軽量表示
				</MenuItem>
				<MenuItem
					onClick={() => props.onChangeTweetViewStyleMode('NO_MEDIAS')}
					icon={props.tweetViewStyleMode === 'NO_MEDIAS' ? <FaCheck /> : undefined}
				>
					画像無し
				</MenuItem>
				<MenuItem
					onClick={() => props.onChangeTweetViewStyleMode('EMBED')}
					icon={props.tweetViewStyleMode === 'EMBED' ? <FaCheck /> : undefined}
				>
					埋め込み表示
				</MenuItem>
				<MenuItem onClick={props.onChangeCollapseMode}>{props.isCollapseRead ? '既読を表示' : '既読を非表示'}</MenuItem>
				<MenuItem as='a' href='#'>
					非表示アカウント設定
				</MenuItem>
			</MenuList>
		</Menu>
	);
}

function OptionsForMobile2(props: { isCollapseRead: boolean; onChangeCollapseMode: () => any }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const items = [
		{
			title: 'Link 1',
			onClick: () => 0,
		},
		{
			title: props.isCollapseRead ? '既読を表示する' : '既読を非表示にする',
			onClick: props.onChangeCollapseMode,
		},
		{
			title: '非表示アカウント設定',
			onClick: () => 0,
		},
	];
	return (
		<Box>
			<Button variant='outline' colorScheme='teal' size='lg' onClick={onOpen} leftIcon={<PiGearFill size={20} />}>
				表示設定
			</Button>
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalBody padding={0}>
						<DividedList itemProps={items} />
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
}

function setupReads(categoryName: string, today: Date) {
	const savedReads = loadReadsFromStorage(categoryName);
	//今日からREADS_SAVE_DAYSより前のreads履歴は削除する。
	const savedReadsRemovedTooOlds = removeReadsNDaysBeforeThenSave(savedReads, today, READS_SAVE_DAYS);
	saveReadsToStorage(categoryName, savedReadsRemovedTooOlds);
	return savedReadsRemovedTooOlds;
}
