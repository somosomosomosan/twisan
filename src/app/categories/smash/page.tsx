import {
	Box,
	Button,
	Card,
	CardBody,
	Center,
	Container,
	Flex,
	Heading,
	Hide,
	Link,
	ListItem,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
	UnorderedList,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import * as Rb from 'rambda';
import { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { COLOR_BORDER, COLOR_SUBTEXT } from '../../../components/TweetComponent/consts';
import { t_dbAuthor, t_dbTweetDataParsed, t_dbTweetScores } from '../../../components/TweetComponent/types';
import TweetComponentList from '../../../components/TweetList/TweetComponentList';
import { t_tweetViewStyleMode } from '../../../components/TweetList/TweetListItem';
import { t_blockedAccount } from '../../../components/TweetList/types';
import { READS_SAVE_DAYS, SITE_TITLE } from '../../../consts';
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
			<Helmet>
				<title>
					{SITE_TITLE.smash} | {SITE_TITLE.base}
				</title>
			</Helmet>
			<Container maxW='100%' centerContent marginTop={4} marginBottom={4}>
				<VStack spacing={4} align='stretch'>
					<Heading
						as='h1'
						size='lg'
						noOfLines={1}
						fontFamily={`Meiryo, "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif`}
					>
						{SITE_TITLE.base}: {SITE_TITLE.smash}
					</Heading>
					<Text size='sm'>スマブラアカウントの間で最近話題の投稿集</Text>
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

	console.log('LoaderWrapper');
	return (
		<Content
			tweetViewStyleMode={tweetViewStyleMode}
			scores={data?.scores ?? []}
			tweets={data?.tweets ?? []}
			authors={data?.authors ?? []}
			blockedAccounts={blockedAccounts}
			readTweets={readTweets}
			today={today}
			finishedScrapingDate={new Date(data?.finished ?? '')}
		/>
	);
}

function chunkScore(scores: t_dbTweetScores[], tweetViewStyleMode: t_tweetViewStyleMode) {
	if (tweetViewStyleMode === 'EMBED') {
		return Rb.splitEvery(3, scores);
	}
	return Rb.splitEvery(5, scores);
}

function Content(
	props: Omit<t_storagedData, 'chunkedScores'> & { scores: t_dbTweetScores[]; today: Date; finishedScrapingDate: Date },
) {
	const [state_collapseRead, set_collapseRead] = useState<boolean>(false);
	/*
	const [state_tweetViewStyleMode, set_tweetViewStyleMode] = useState<t_tweetViewStyleMode>(props.tweetViewStyleMode);
	const [state_chunkedScores, set_chunkedScores] = useState<t_dbTweetScores[][]>(
		chunkScore(props.scores, props.tweetViewStyleMode),
	);
	*/
	/*
	おそらくinfinite scrollの方でstateを保持し続けてるためここで途中で変更しても変わらない
	ページ再読み込みさせるしか
	useEffect(() => {
		set_chunkedScores(chunkScore(props.scores, state_tweetViewStyleMode));
	}, [props.scores, state_tweetViewStyleMode]);
	*/

	return (
		<Box>
			<Container maxW='100%' centerContent marginBottom={4}>
				<VStack spacing={4}>
					<Box>
						<Text color={COLOR_SUBTEXT}>集計日時: {format(props.finishedScrapingDate, 'HH:mm · yyyy/MM/dd')}</Text>
						<Text color={COLOR_SUBTEXT} fontSize={'sm'}>
							1時間～1時間半毎に集計努力
						</Text>
					</Box>

					<Hide below='lg'>
						<OptionsForPc
							isCollapseRead={state_collapseRead}
							onChangeCollapseMode={() => set_collapseRead((e) => !e)}
							tweetViewStyleMode={props.tweetViewStyleMode}
							onChangeTweetViewStyleMode={(e) => {
								//set_tweetViewStyleMode(e);
								saveTweetViewStyleMode(e);
								window.location.reload();
							}}
						/>
					</Hide>
					<Hide above='lg'>
						<TipsForMobile />
						<OptionsForMobile
							isCollapseRead={state_collapseRead}
							onChangeCollapseMode={() => set_collapseRead((e) => !e)}
							tweetViewStyleMode={props.tweetViewStyleMode}
							onChangeTweetViewStyleMode={(e) => {
								//set_tweetViewStyleMode(e);
								saveTweetViewStyleMode(e);
								window.location.reload();
							}}
						/>
					</Hide>
				</VStack>
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
							chunkedScores={chunkScore(props.scores, props.tweetViewStyleMode)}
							tweetViewStyleMode={props.tweetViewStyleMode}
							categoryName={CATEGORY_NAME}
							collapseRead={state_collapseRead}
							today={props.today}
						/>
					</Suspense>
				</Box>
				<Hide below='lg'>
					<Box maxW={'312px'} minW={'300px'} alignItems={'start'}>
						<Box
						//position={'fixed'} maxW={'312px'} minW={'300px'} //固定化する場合はこれ
						>
							<VStack spacing={4}>
								<TipsForPc />
								<LinksForPc />
							</VStack>
							{/*
						<Link to={'/'}>ホーム</Link>
						<Text>AD!</Text>
						*/}
						</Box>
					</Box>
				</Hide>
			</Flex>
		</Box>
	);
}

function Tips(props: { isPc: boolean }) {
	const viewModeGuideText = props.isPc ? '投稿表示設定' : '表示設定';
	return (
		<UnorderedList spacing={3}>
			<ListItem>投稿をクリックするといろいろできます。</ListItem>
			<ListItem>通信量が気になる方は、「{viewModeGuideText}」→「画像無し」をどうぞ。</ListItem>
			<ListItem>データ収集精度はこれから徐々に良くなっていきます。</ListItem>
		</UnorderedList>
	);
}

function TipsForPc() {
	return (
		<Card textAlign={'left'} marginLeft={'24px'} width={'100%'} variant={'outline'}>
			<CardBody>
				<VStack spacing={2}>
					<Center>
						<MdOutlineTipsAndUpdates size={32} />
					</Center>
					<Tips isPc={true} />
				</VStack>
			</CardBody>
		</Card>
	);
}

function LinksForPc() {
	return (
		<Card textAlign={'left'} marginLeft={'24px'} width={'100%'} variant={'outline'}>
			<CardBody>
				<Link fontSize={12} href={'https://somosomosomosan.github.io/texttoimage/'} isExternal>
					文章画像化ツール
				</Link>
			</CardBody>
		</Card>
	);
}

function TipsForMobile() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box>
			<Button leftIcon={<MdOutlineTipsAndUpdates />} variant='outline' colorScheme='yellow' size='xs' onClick={onOpen}>
				Tips
			</Button>
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent onClick={onClose}>
					<ModalHeader>Tips</ModalHeader>
					<ModalBody>
						<Tips isPc={false} />
					</ModalBody>
				</ModalContent>
			</Modal>
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
				{/*
				<Button variant='outline' colorScheme='teal' size='lg'>
					非表示アカウント設定
				</Button>
				*/}
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
				{/*
				<MenuItem as='a' href='#'>
					非表示アカウント設定
				</MenuItem>
				*/}
			</MenuList>
		</Menu>
	);
}

function setupReads(categoryName: string, today: Date) {
	const savedReads = loadReadsFromStorage(categoryName);
	//今日からREADS_SAVE_DAYSより前のreads履歴は削除する。
	const savedReadsRemovedTooOlds = removeReadsNDaysBeforeThenSave(savedReads, today, READS_SAVE_DAYS);
	saveReadsToStorage(categoryName, savedReadsRemovedTooOlds);
	return savedReadsRemovedTooOlds;
}
