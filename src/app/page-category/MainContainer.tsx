import { Alert, AlertIcon, Box, Container, Flex, HStack, Hide, Text, VStack } from '@chakra-ui/react';
import { differenceInHours, format } from 'date-fns';
import { useCallback, useState } from 'react';
import { DETECT_STOPPING_SCRAPING_HOUR } from '../../consts';
import { t_categoryInfo } from '../../types';
import { COLOR_BORDER } from '../tweet-components/inners/consts';
import { saveTweetViewStyleMode } from '../util-funcs/localStorages';
import { ColorSwitchButton } from './ColorSwitchButton';
import { DonationForMobile } from './DonationForMobile';
import { DonationForPc } from './DonationForPc';
import { LinksForPc } from './LinksForPc';
import { MyTwitter } from './MyTwitter';
import { OptionsForMobile } from './OptionsForMobile';
import { OptionsForPc } from './OptionsForPc';
import { RankingHistoriesSelector } from './RankingHistoriesSelector';
import { TipsForMobile } from './TipsForMobile';
import { TipsForPc } from './TipsForPc';
import { useBearRankingHistories, useBearRankingItemData, useBearToday, useBearViewStyleMode } from './bearHooks';
import { SPACE_V_STACK } from './consts';
import { setupReads } from './reads';
import TweetRankings from './tweet-rankings/TweetRankings';

export function MainContainer(props: {
	categoryUrl: t_categoryInfo['url'];
	finishedScrapingDate: Date;
	isLatestHistory: boolean;
}) {
	const today = useBearToday((state) => state.date);

	const isLooksLikeStoppingScraping =
		props.isLatestHistory && differenceInHours(today, props.finishedScrapingDate) > DETECT_STOPPING_SCRAPING_HOUR
			? true
			: false;

	const { state_collapseRead, onChangeCollapseReadsMode } = useReadCollapse(props.categoryUrl);
	const rankingHistories = useBearRankingHistories((state) => state.data);
	//ViewStyleModeの変更と適用は ストレージ更新→ブラウザリロード なのでstateは更新しない
	const viewStyleMode = useBearViewStyleMode((state) => state.mode);
	return (
		<Box>
			<Container maxW='100%' centerContent marginBottom={4}>
				<VStack spacing={SPACE_V_STACK}>
					<Box>
						<Text className='subText'>集計日時: {format(props.finishedScrapingDate, 'HH:mm · yyyy/MM/dd')}</Text>
						<Text className='subText' fontSize={'sm'}>
							4時間～4時間半毎に集計努力
						</Text>
						{isLooksLikeStoppingScraping && (
							<Alert status='error'>
								<AlertIcon />
								<Text>
									現在、何らかの事情により集計が行われていません。
									<MyTwitter />
								</Text>
							</Alert>
						)}
					</Box>

					<RankingHistoriesSelector rankingHistories={rankingHistories} />

					<Hide below='lg'>
						<Box position={'absolute'} top={0} right={0}>
							<ColorSwitchButton />
						</Box>
						<OptionsForPc
							isCollapseRead={state_collapseRead}
							onChangeCollapseReadsMode={onChangeCollapseReadsMode}
							tweetViewStyleMode={viewStyleMode}
							onChangeTweetViewStyleMode={(e) => {
								saveTweetViewStyleMode(e);
								window.location.reload();
							}}
						/>
					</Hide>
					<Hide above='lg'>
						<Box position={'absolute'} top={'150px'} right={0}>
							<ColorSwitchButton />
						</Box>

						<OptionsForMobile
							isCollapseRead={state_collapseRead}
							onChangeCollapseReadsMode={onChangeCollapseReadsMode}
							tweetViewStyleMode={viewStyleMode}
							onChangeTweetViewStyleMode={(e) => {
								//set_tweetViewStyleMode(e);
								saveTweetViewStyleMode(e);
								window.location.reload();
							}}
						/>
						<HStack>
							<TipsForMobile />
							<DonationForMobile />
						</HStack>
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
					<TweetRankings categoryUrl={props.categoryUrl} isCollapsingReads={state_collapseRead} />
				</Box>
				<Hide below='lg'>
					<Box maxW={'312px'} minW={'300px'} alignItems={'start'}>
						<Box>
							<VStack spacing={SPACE_V_STACK}>
								<TipsForPc />
								<DonationForPc />
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
function useReadCollapse(categoryUrl: string) {
	const today = useBearToday((state) => state.date);
	const updateReads = useBearRankingItemData((state) => state.updateReads);
	const [state_collapseRead, set_collapseRead] = useState<boolean>(false);
	const onChangeCollapseReadsMode = useCallback(() => {
		//storageのreadを読み込んでstateに反映
		const reads = setupReads(categoryUrl, today);
		updateReads(reads);
		//state_collapseReadを反転
		set_collapseRead(!state_collapseRead);
	}, [state_collapseRead, categoryUrl, today, updateReads]);

	return {
		state_collapseRead,
		onChangeCollapseReadsMode,
	};
}

/*
export function MainContentOfCategory(
	props: Omit<t_storagedData, 'chunkedScores' | 'readTweets'> & {
		categoryInfo: t_categoryInfo;
		scores: t_dbTweetScores[];
		today: Date;
		finishedScrapingDate: Date;
		rankingHistories: t_rankingHistory[];
		isLooksLikeStoppingScraping: boolean;
	},
) {
	const { state_collapseRead, state_reads, onChangeCollapseReadsMode } = useReads(props.categoryInfo.url, props.today);
	return (
		<Box>
			<Container maxW='100%' centerContent marginBottom={4}>
				<VStack spacing={SPACE_V_STACK}>
					<Box>
						<Text className='subText'>集計日時: {format(props.finishedScrapingDate, 'HH:mm · yyyy/MM/dd')}</Text>
						<Text className='subText' fontSize={'sm'}>
							2時間～2時間半毎に集計努力
						</Text>
						{props.isLooksLikeStoppingScraping && (
							<Alert status='error'>
								<AlertIcon />
								<Text>
									現在、何らかの事情により集計が行われていません。
									<MyTwitter />
								</Text>
							</Alert>
						)}
					</Box>

					<RankingHistoriesSelector rankingHistories={props.rankingHistories} />

					<Hide below='lg'>
						<Box position={'absolute'} top={0} right={0}>
							<ColorSwitchButton />
						</Box>
						<OptionsForPc
							isCollapseRead={state_collapseRead}
							onChangeCollapseReadsMode={onChangeCollapseReadsMode}
							tweetViewStyleMode={props.tweetViewStyleMode}
							onChangeTweetViewStyleMode={(e) => {
								//set_tweetViewStyleMode(e);
								saveTweetViewStyleMode(e);
								window.location.reload();
							}}
						/>
					</Hide>
					<Hide above='lg'>
						<Box position={'absolute'} top={'150px'} right={0}>
							<ColorSwitchButton />
						</Box>

						<OptionsForMobile
							isCollapseRead={state_collapseRead}
							onChangeCollapseReadsMode={onChangeCollapseReadsMode}
							tweetViewStyleMode={props.tweetViewStyleMode}
							onChangeTweetViewStyleMode={(e) => {
								//set_tweetViewStyleMode(e);
								saveTweetViewStyleMode(e);
								window.location.reload();
							}}
						/>
						<HStack>
							<TipsForMobile />
							<DonationForMobile />
						</HStack>
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
							categoryName={props.categoryInfo.url}
							collapseRead={state_collapseRead}
							today={props.today}
							readTweets={state_reads}
						/>
					</Suspense>
				</Box>
				<Hide below='lg'>
					<Box maxW={'312px'} minW={'300px'} alignItems={'start'}>
						<Box>
							<VStack spacing={SPACE_V_STACK}>
								<TipsForPc />
								<DonationForPc />
								<LinksForPc />
							</VStack>

						</Box>
					</Box>
				</Hide>
			</Flex>
		</Box>
	);
}

function useReads(categoryUrl: string, today: Date) {
	const [state_collapseRead, set_collapseRead] = useState<boolean>(false);
	const [state_reads, set_reads] = useState<t_reads[]>(setupReads(categoryUrl, today));
	const onChangeCollapseReadsMode = useCallback(() => {
		set_collapseRead(!state_collapseRead);
		if (state_collapseRead) {
			return;
		}
		set_reads(setupReads(categoryUrl, today));
	}, [state_collapseRead, today, categoryUrl]);

	return {
		state_collapseRead,
		state_reads,
		onChangeCollapseReadsMode,
	};
}
	function chunkScore(scores: t_dbTweetScores[], tweetViewStyleMode: t_tweetViewStyleMode) {
	if (tweetViewStyleMode === 'EMBED') {
		return Rb.splitEvery(3, scores);
	}
	return Rb.splitEvery(5, scores);
}

	*/
