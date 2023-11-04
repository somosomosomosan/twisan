import { Container, Heading, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { differenceInHours } from 'date-fns';
import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { t_categoryInfo } from '../../app/categories/types';
import { DETECT_STOPPING_SCRAPING_HOUR, SITE_TITLE } from '../../consts';
import { getRankingData2, getRankingHistories } from '../../utilfuncs/getRankingData';
import { loadBlockedAccountsFromStorage, loadTweetViewStyleMode } from '../../utilfuncs/localStorages';
import { MainContentOfCategiry } from './MainContentOfCategiry';
import { NoRankingData } from './NoRankingData';
import { NotTheCurrentHistoryAlert } from './NotTheCurrentHistoryAlert';
import { SPACE_V_STACK } from './consts';

export default function CategoryPage(props: { categoryInfo: t_categoryInfo }) {
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
			{rankingFileName && <NotTheCurrentHistoryAlert categoryName={props.categoryInfo.name} />}
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
				<ContentLoaderWrapper categoryInfo={props.categoryInfo} rankingFileName={rankingFileName} />
			</Suspense>
		</div>
	);
}

function ContentLoaderWrapper(props: { categoryInfo: t_categoryInfo; rankingFileName: string | undefined | null }) {
	const { data: rankingHistories } = useQuery({
		queryKey: [`${props.categoryInfo.url}-histories`],
		queryFn: () => getRankingHistories(props.categoryInfo.url),
		cacheTime: 1,
		staleTime: 1,
	});

	const rankingFileInfo = props.rankingFileName
		? rankingHistories?.find((e) => e.file_name === props.rankingFileName)
		: rankingHistories?.[0];

	const { data: rankingData } = useQuery({
		queryKey: [`${props.categoryInfo.url}-ranking`],
		queryFn: () => getRankingData2(props.categoryInfo.url, rankingFileInfo?.file_name ?? ''),
	});

	if (!rankingData) {
		return <NoRankingData />;
	}

	const blockedAccounts = loadBlockedAccountsFromStorage(props.categoryInfo.url);
	const tweetViewStyleMode = loadTweetViewStyleMode();
	const finishedScrapingDate = new Date(rankingFileInfo?.created_at ?? '');
	const today = new Date();
	const isLooksLikeStoppingScraping = props.rankingFileName
		? false
		: differenceInHours(today, finishedScrapingDate) > DETECT_STOPPING_SCRAPING_HOUR
		? true
		: false;

	return (
		<MainContentOfCategiry
			categoryInfo={props.categoryInfo}
			tweetViewStyleMode={tweetViewStyleMode}
			scores={rankingData?.scores ?? []}
			tweets={rankingData?.tweets ?? []}
			authors={rankingData?.authors ?? []}
			blockedAccounts={blockedAccounts}
			today={today}
			finishedScrapingDate={finishedScrapingDate}
			rankingHistories={rankingHistories ?? []}
			isLooksLikeStoppingScraping={isLooksLikeStoppingScraping}
		/>
	);
}
