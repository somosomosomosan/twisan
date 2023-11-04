import { t_categoryInfo } from './app/categories/types';

//ローカルなら無（''） github pagesスラッシュから始まる 例：/twisan
const REPO_NAME = process.env.PUBLIC_URL;
export const PATH_RANKING_DATA = `${REPO_NAME}/data`;
export const PATH_ASSETS = `${REPO_NAME}/assets`;
export const READS_SAVE_DAYS = 3;
export const DETECT_STOPPING_SCRAPING_HOUR = 2;

export const CATEGORY_INFO_SMASH: t_categoryInfo = {
	name: 'スマブラ',
	url: 'smash',
};

export const SITE_TITLE = {
	base: '', //●● Global Rankings
	smash: 'スマブラ', //スマブラ
};

export const SITE_DESCRIPTION = {
	smash1: 'X(Twitter)のスマブラアカウントの間で',
	smash2: '最近話題の投稿集',
};
