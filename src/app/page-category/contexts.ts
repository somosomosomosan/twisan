import { createContext } from 'react';
import { t_categoryInfo } from '../../types';
import { t_tweetViewStyleMode } from '../tweet-components/outers/TweetRankingItemsContainer';
import { t_rankingHistory } from '../util-funcs/getRankingData';
import { t_tweetListItemData } from './types';

/**
・呼び出し側がジェネリクスAもジェネリクスBを指定しなかった場合は、getterの引数は無し。
・呼び出し側がジェネリクスAを指定してジェネリクスBは指定しなかった場合は、getterの引数はa:Aの1つのみ。
・呼び出し側がジェネリクスAとジェネリクスBを指定した場合は、getterの引数はa:Aとb:Bの2つ。
 */
export type t_context<T, A = undefined, B = undefined> = {
	getter: [A, B] extends [undefined, undefined] ? () => T : [B] extends [undefined] ? (a: A) => T : (a: A, b: B) => T;
	setter: (a: T) => any;
};

export const ContextRankingHistories = createContext<t_context<t_rankingHistory[], t_categoryInfo>>({
	getter: () => [],
	setter: () => true,
});
export const ContextRankingItemData = createContext<t_context<t_tweetListItemData[], t_categoryInfo, string>>({
	getter: () => [],
	setter: () => true,
});
export const ContextViewStyleMode = createContext<t_context<t_tweetViewStyleMode>>({
	getter: () => 'CUSTOM',
	setter: () => true,
});
export const ContextToday = createContext<t_context<Date>>({
	getter: () => new Date(),
	setter: () => true,
});
