export function generateTweetUrl(screenName: string = '_', tweetId: string = '0') {
	return `https://twitter.com/${screenName}/status/${tweetId}`;
}
