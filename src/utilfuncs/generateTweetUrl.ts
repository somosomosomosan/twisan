export function generateTweetUrl(screenName: string = '_', tweetId: string = '0') {
	return `https://x.com/${screenName}/status/${tweetId}`;
}
