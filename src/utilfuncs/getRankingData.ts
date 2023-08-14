import { t_dbAuthor, t_dbTweetDataParsed, t_dbTweetScores } from '../components/TweetComponent/types';
import { PATH_RANKING_DATA } from '../consts';

export type t_dataRanking = { scores: t_dbTweetScores[]; tweets: t_dbTweetDataParsed[]; authors: t_dbAuthor[] };

export async function getRankingData(catName: string): Promise<t_dataRanking> {
	const filePath = `${PATH_RANKING_DATA}/${catName}/mock.json`;
	//fetch() は Promise を返す（返り値を変数に代入する場合）
	const response = await fetch(filePath);
	if (!response.ok) {
		throw new Error('????????');
	}
	return response.json() as Promise<t_dataRanking>;
}
