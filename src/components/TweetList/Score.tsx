/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { COLOR_SUBTEXT, SIZE_TEXT_XS } from '../TweetComponent/consts';

export default function Score(props: { score: number }) {
	return (
		<div css={styles.container}>
			<p css={styles.scoreText}>{Math.floor(props.score)}</p>
			<p css={styles.scoreMeasureWord}>pt</p>
		</div>
	);
}

const styles = {
	container: css({
		display: 'flex',
		flexDirection: 'row',
	}),
	scoreText: css({
		fontSize: SIZE_TEXT_XS,
		color: COLOR_SUBTEXT,
	}),
	scoreMeasureWord: {
		fontSize: SIZE_TEXT_XS,
		color: COLOR_SUBTEXT,
		marginLeft: 2,
	},
};
