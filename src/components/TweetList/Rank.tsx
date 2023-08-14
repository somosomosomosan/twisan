/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FaAward } from 'react-icons/fa';
import { COLOR_SUBTEXT, SIZE_TEXT_S, SIZE_TEXT_XS } from '../TweetComponent/consts';

export default function Rank(props: { rank: number }) {
	return (
		<div css={styles.container}>
			<FaAward size={SIZE_TEXT_S} color={COLOR_SUBTEXT} />
			<p css={styles.rankText}>{props.rank}</p>
			<p css={styles.rankMeasureWord}>位</p>
		</div>
	);
}

const styles = {
	container: css({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	}),
	rankText: css({
		fontSize: SIZE_TEXT_XS,
		fontWeight: '700',
		color: COLOR_SUBTEXT,
	}),
	rankMeasureWord: {
		fontSize: SIZE_TEXT_XS,
		fontWeight: '700',
		color: COLOR_SUBTEXT,
	},
};
