//ローカルなら無（''） github pagesスラッシュから始まる 例：/twisan
const REPO_NAME = process.env.PUBLIC_URL;
export const PATH_RANKING_DATA = `${REPO_NAME}/data`;
export const PATH_ASSETS = `${REPO_NAME}/assets`;
export const READS_SAVE_DAYS = 3;
export const DETECT_STOPPING_SCRAPING_HOUR = 2;

export const SITE_TITLE = {
	base: '●● Global Rankings',
	smash: 'スマブラ',
};
