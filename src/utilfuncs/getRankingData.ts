import { t_dbAuthor, t_dbTweetDataParsed, t_dbTweetScores } from '../components/TweetComponent/types';
import { PATH_RANKING_DATA } from '../consts';

export type t_dataRanking = {
	scores: t_dbTweetScores[];
	tweets: t_dbTweetDataParsed[];
	authors: t_dbAuthor[];
	finished: string;
};

type t_rankingHistoryRaw = {
	file_name: string;
	created_at: string;
};
export type t_rankingHistory = {
	file_name: string;
	created_at: Date;
};

export async function getRankingData(catName: string): Promise<t_dataRanking> {
	const filePath = `${PATH_RANKING_DATA}/${catName}/ranking.json`;
	//fetch() は Promise を返す（返り値を変数に代入する場合）
	const response = await fetch(filePath);
	if (!response.ok) {
		throw new Error('????????');
	}
	return response.json() as Promise<t_dataRanking>;
}

export async function getRankingData2(catName: string, fileName: string): Promise<t_dataRanking> {
	const filePath = `${PATH_RANKING_DATA}/${catName}/${fileName}.json`;
	//fetch() は Promise を返す（返り値を変数に代入する場合）
	const response = await fetch(filePath);
	if (!response.ok) {
		throw new Error('????????');
	}
	return response.json() as Promise<t_dataRanking>;
}

export async function getRankingHistories(catName: string): Promise<t_rankingHistory[]> {
	const filePath = `${PATH_RANKING_DATA}/${catName}/histories.json`;
	//fetch() は Promise を返す（返り値を変数に代入する場合）
	const response = await fetch(filePath);
	if (!response.ok) {
		throw new Error('????????');
	}
	const r = (await response.json()) as t_rankingHistoryRaw[];
	return r.map((e) => ({ ...e, created_at: new Date(e.created_at) }));
}
