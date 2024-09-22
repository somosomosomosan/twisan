import { Container, Heading, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { SITE_TITLE } from '../../consts';
import { t_categoryInfo } from '../../types';
import { getRankingData2, getRankingHistories, t_rankingHistory } from '../util-funcs/getRankingData';
import { loadBlockedAccountsFromStorage, loadTweetViewStyleMode } from '../util-funcs/localStorages';
import { MainContainer } from './MainContainer';
import { NotTheCurrentHistoryAlert } from './NotTheCurrentHistoryAlert';
import { useBearRankingHistories, useBearRankingItemData, useBearToday, useBearViewStyleMode } from './bearHooks';
import { SPACE_V_STACK } from './consts';
import { setupReads } from './reads';

export default function PageCategory(props: { categoryInfo: t_categoryInfo }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const rankingFileName = searchParams.get('r');
	const description1 = `X(Twitter)の${props.categoryInfo.name}アカウントの間で`;
	const description2 = '最近話題の投稿集';
	return (
		<div>
			<Helmet>
				<title>
					{SITE_TITLE.smash} {SITE_TITLE.base}
				</title>
				<meta name='description' content={`${description1}${description2}`} />
			</Helmet>
			{rankingFileName && <NotTheCurrentHistoryAlert categoryUrl={props.categoryInfo.url} />}
			<Container maxW='100%' centerContent marginTop={4} marginBottom={4}>
				<VStack spacing={SPACE_V_STACK} align='stretch'>
					<Heading
						as='h1'
						size='lg'
						noOfLines={1}
						fontFamily={`Meiryo, "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif`}
					>
						{props.categoryInfo.name}
					</Heading>
					<Heading as='h2' size='sm' lineHeight={1.5} fontWeight={'normal'}>
						<span style={{ display: 'inline-block' }}>{description1}</span>
						<span style={{ display: 'inline-block' }}>{description2}</span>
					</Heading>
				</VStack>
			</Container>
			<Suspense fallback={<div>Loading...</div>}>
				<Wrapper categoryInfo={props.categoryInfo} rankingFileName={rankingFileName} />
			</Suspense>
		</div>
	);
}

function Wrapper(props: { categoryInfo: t_categoryInfo; rankingFileName: string | undefined | null }) {
	//ランキングデータをダウンロードしたらフォーマットとかしてグローバルステートに格納。ランキングページからドネーションページなどへ遷移して戻ってきたときはランキングデータのダウンロードはせずにグローバルステートのを利用する。

	const histories = useBearRankingHistories((state) => state.data);
	const rankingItemDataLength = useBearRankingItemData((state) => state.data.length);

	//console.log({ histories, rankingItemDataLength, trigger: histories.length === 0 && rankingItemDataLength === 0 });

	return histories.length === 0 && rankingItemDataLength === 0 ? (
		<LoaderWrapper categoryInfo={props.categoryInfo} rankingFileName={props.rankingFileName} />
	) : (
		<MainContainer
			categoryUrl={props.categoryInfo.url}
			finishedScrapingDate={new Date(getRankingInfo(histories ?? [], props.rankingFileName ?? '').created_at)}
			isLatestHistory={props.rankingFileName ? false : true}
		/>
	);
}

function LoaderWrapper(props: { categoryInfo: t_categoryInfo; rankingFileName: string | undefined | null }) {
	//const rand = randomNum();
	//console.log('LoaderWrapper');

	const today = useBearToday((state) => state.date);
	//console.log('after useBearToday - ' + rand);

	const { data } = useQuery({
		queryKey: [`${props.categoryInfo.url}`],
		queryFn: async () => {
			const rankingHistories = await getRankingHistories(props.categoryInfo.url);
			const rankingFileInfo = getRankingInfo(rankingHistories ?? [], props.rankingFileName ?? '');
			const rankingData = await getRankingData2(props.categoryInfo.url, rankingFileInfo.file_name);
			return { rankingHistories, rankingFileInfo, rankingData };
		},
		cacheTime: Infinity,
		staleTime: Infinity,
	});
	//console.log('after useQuery - ' + rand);

	const setViewStyleMode = useBearViewStyleMode((state) => state.setMode);
	const tweetViewStyleMode = loadTweetViewStyleMode();
	setViewStyleMode(tweetViewStyleMode);
	//console.log('after useBearViewStyleMode - ' + rand);

	const setRankingHistories = useBearRankingHistories((state) => state.setData);
	setRankingHistories(data?.rankingHistories ?? []);
	//console.log('after useBearRankingHistories - ' + rand);

	const ngs = loadBlockedAccountsFromStorage(props.categoryInfo.url);
	const reads = setupReads(props.categoryInfo.url, today);
	const setRankingItemData = useBearRankingItemData((state) => state.setData);
	setRankingItemData(data?.rankingData, ngs, reads);
	//console.log('after useBearRankingItemData - ' + rand);

	const finishedScrapingDate = new Date(data?.rankingFileInfo.created_at ?? '');

	//console.log({ ...data, ngs, reads, finishedScrapingDate });

	return (
		<MainContainer
			categoryUrl={props.categoryInfo.url}
			finishedScrapingDate={finishedScrapingDate}
			isLatestHistory={props.rankingFileName ? false : true}
		/>
	);
}

function getRankingInfo(rankingHistories: t_rankingHistory[], rankingFileName: string): t_rankingHistory {
	const rankingFileInfo = rankingFileName
		? rankingHistories.find((e) => e.file_name === rankingFileName)
		: rankingHistories[0];
	return rankingFileInfo ?? { created_at: new Date(), file_name: '' };
}
