/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import NoEscapeChakraText from '../utilCompos/NoEscapeChakraText';
import { COLOR_LIGHTBLACK } from './consts';
import { t_poll } from './types';

export default function Poll(props: { polls: t_poll[] }) {
	return (
		<div css={styles.pollContainer}>
			{props.polls.map((e, i) => (
				<div key={i} css={[styles.pollItem, i !== 0 && styles.pollItemNotTop]}>
					<div css={styles.pollBorder}></div>
					<div css={styles.pollTextContainer}>
						<NoEscapeChakraText
							text={e.label}
							chakraProps={{
								css: styles.pollTextAndValue,
								noOfLines: 1,
							}}
						/>
					</div>
					<div css={styles.pollValueContainer}>
						<p css={styles.pollTextAndValue}>{e.votes}</p>
					</div>
				</div>
			))}
		</div>
	);
}

const styles = {
	pollContainer: css({
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		width: '100%',
	}),
	pollItem: css({
		height: 32,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		position: 'relative',
	}),
	pollItemNotTop: css({
		marginTop: 4,
	}),
	pollBorder: css({
		width: 7,
		backgroundColor: 'rgba(29, 155, 240, 0.58)',
		borderBottomLeftRadius: 4,
		borderTopLeftRadius: 4,
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		borderRadius: 4,
	}),
	pollTextContainer: css({
		paddingLeft: 12,
		paddingRight: 12,
		width: '80%',
		textAlign: 'left',
	}),
	pollTextAndValue: css({
		fontWeight: '700',
		fontSize: 15,
		color: COLOR_LIGHTBLACK,
		//lineHeight: '20px',
	}),
	pollValueContainer: css({
		paddingLeft: 12,
	}),
};
