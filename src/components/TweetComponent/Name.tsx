/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { MdVerified } from 'react-icons/md';
import NoEscapeChakraText from '../utilCompos/NoEscapeChakraText';
import { COLOR_LIGHTBLACK, COLOR_LINK, COLOR_SUBTEXT, SIZE_TEXT_S } from './consts';

type P_name = {
	name: string;
	verified?: boolean;
};
export function Name(props: P_name) {
	return (
		<div css={styles.nameContainer}>
			<NoEscapeChakraText
				text={props.name}
				chakraProps={{
					css: styles.textName,
					noOfLines: 1,
				}}
			/>
			{props.verified && <VerifiedComponent />}
		</div>
	);
}

type P_screenName = {
	screenName: string;
	separator?: boolean;
};
export function ScreenName(props: P_screenName) {
	return (
		<NoEscapeChakraText
			text={`@${props.screenName}`}
			chakraProps={{
				css: [styles.textScreenName, props.separator && styles.m4],
				noOfLines: 1,
			}}
		/>
	);
}

type P_nameAndUsername = P_name & P_screenName;
/**
 * 名前とスクリーンネームを一列で。
 */
export function NameAndScreenName(props: Omit<P_nameAndUsername, 'separator'>) {
	return (
		<div css={styles.oneRowContainer}>
			<Name name={props.name} verified={props.verified} />
			<ScreenName screenName={props.screenName} separator={true} />
		</div>
	);
}

function VerifiedComponent() {
	return (
		<div css={styles.varified}>
			<MdVerified size={SIZE_TEXT_S} color={COLOR_LINK} />
		</div>
	);
}

const styles = {
	oneRowContainer: css({
		display: 'flex',
		flexDirection: 'row',
	}),
	nameContainer: css({
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		minWidth: '1rem',
	}),
	textName: css({
		color: COLOR_LIGHTBLACK,
		fontSize: SIZE_TEXT_S,
		fontWeight: '700',
	}),
	varified: css({
		marginLeft: 2,
	}),
	textScreenName: css({
		color: COLOR_SUBTEXT,
		fontSize: SIZE_TEXT_S,
		textAlign: 'left',
	}),
	m4: css({
		marginLeft: 4,
	}),
};
