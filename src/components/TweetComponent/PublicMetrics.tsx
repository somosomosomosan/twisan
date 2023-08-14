import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { AiOutlineHeart, AiOutlineRetweet } from 'react-icons/ai';
import { VscComment } from 'react-icons/vsc';
import { COLOR_SUBTEXT, SIZE_TEXT_M, SIZE_TEXT_S, SPACE_BASE } from './consts';

type P_publicMetrics = {
	likes: number;
	retweets: number;
	quotes: number;
	replies: number;
};
/**
 * Likes, Retweets, Quotes, Replies。
 * RTとQuoteは併せて数えることにする。本家埋め込みはそうしてるし、それはQuoteを置くスペースが無いから。
 */
export default function PublicMetrics(props: P_publicMetrics) {
	return (
		<div css={styles.container}>
			<Replies count={props.replies} />
			<Retweets count={props.retweets + props.quotes} />
			<Likes count={props.likes} />
		</div>
	);
}

type P = {
	count: number;
};

const Likes = (props: P) => (
	<Base count={props.count}>
		<AiOutlineHeart size={SIZE_TEXT_M} color={COLOR_SUBTEXT} />
	</Base>
);
const Retweets = (props: P) => (
	<Base count={props.count}>
		<AiOutlineRetweet size={SIZE_TEXT_M} color={COLOR_SUBTEXT} />
	</Base>
);
const Replies = (props: P) => (
	<Base count={props.count}>
		<VscComment size={SIZE_TEXT_M} color={COLOR_SUBTEXT} />
	</Base>
);

type P_base = P & {
	children: React.ReactNode;
};
const Base = (props: P_base) => {
	const count = valueFloor(props.count);
	return (
		<div css={styles.containerActions}>
			<div css={styles.containerActionIcon}>{props.children}</div>
			<span css={styles.actionCounts}>{count}</span>
		</div>
	);
};

/**
 * たとえば123456なら12.3万
 * @param value
 * @returns
 */
const valueFloor = (value: number) => {
	if (value >= 10000) {
		return Math.floor((value / 10000) * Math.pow(10, 1)) / Math.pow(10, 1) + '万';
	}
	return value;
};

const styles = {
	container: css({
		display: 'flex',
		flexWrap: 'nowrap',
		flexDirection: 'row',
		paddingBottom: SPACE_BASE / 2,
	}),
	containerActions: css({
		display: 'flex',
		flexDirection: 'row',
		marginRight: SPACE_BASE * 2,
		alignItems: 'baseline',
	}),
	containerActionIcon: css({
		width: SPACE_BASE * 3,
		height: SPACE_BASE * 4,
		display: 'flex',
		alignItems: 'baseline',
		position: 'relative',
		top: 2,
	}),
	actionCounts: css({
		fontSize: SIZE_TEXT_S,
		color: COLOR_SUBTEXT,
		marginLeft: SPACE_BASE / 2,
	}),
};
