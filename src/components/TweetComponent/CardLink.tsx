import { Image, Text } from '@chakra-ui/react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import NoEscapeChakraText from '../utilCompos/NoEscapeChakraText';
import TouchableHighlight from '../utilCompos/TouchableHighlight';
import ImageGallery from './ImageGallery';
import { COLOR_BORDER, COLOR_LIGHTBLACK, COLOR_SUBTEXT, SPACE_BASE_M } from './consts';
import { t_cardLink } from './types';

export default function CardLink(props: t_cardLink) {
	if (!props.photo_height || !props.photo_width) {
		return null;
	}
	if (props.photo_height === props.photo_width) {
		return <CardSmallSquare {...props} />;
	}
	return <CardLarge {...props} />;
}
function CardSmallSquare(props: t_cardLink) {
	return (
		<TouchableHighlight
			boxProps={{
				onClick: () => {
					window.open(props.url);
				},
			}}
		>
			<div css={styles.containerPrimalSmallSquare}>
				<div css={styles.containerImageSmallSquare}>
					<Image htmlWidth='100%' htmlHeight={'100%'} src={props.photo_url} />
				</div>
				<CardInfo url={props.domain} description={props.description} title={props.title} />
			</div>
		</TouchableHighlight>
	);
}

function CardLarge(props: t_cardLink) {
	return (
		<TouchableHighlight
			boxProps={{
				onClick: () => {
					window.open(props.url);
				},
			}}
		>
			<ImageGallery
				medias={[{ type: 'photo', url: props.photo_url, height: props.photo_height, width: props.photo_width }]}
				Info={<CardInfo url={props.domain} description={props.description} title={props.title} />}
				//これが無いとリンク先に飛ばない
				onImageGallery={() => window.open(props.url)}
			/>
		</TouchableHighlight>
	);
}

function CardInfo(props: { url: string; description?: string; title?: string }) {
	return (
		<div css={styles.containerInfos}>
			<Text css={[styles.textBase, styles.textUrl]} noOfLines={1}>
				{props.url}
			</Text>
			<NoEscapeChakraText
				text={props.title ?? ''}
				chakraProps={{
					css: [styles.textBase, styles.textTitle],
					noOfLines: 1,
				}}
			/>
			<NoEscapeChakraText
				text={props.description ?? ''}
				chakraProps={{
					css: [styles.textBase, styles.textDescription],
					noOfLines: 2,
				}}
			/>
		</div>
	);
}

const styles = {
	//大親コンテナ
	//大親コンテナ 正方形イメージタイプ
	containerPrimalSmallSquare: css({
		display: 'flex',
		flexDirection: 'row',
	}),
	//画像コンテナ 正方形イメージタイプ
	containerImageSmallSquare: css({
		width: 130,
		height: 130,
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
		borderRightWidth: 1,
		borderColor: COLOR_BORDER,
		overflow: 'hidden',
	}),
	//画像コンテナ 正方形イメージタイプ
	containerImageLarge: css({
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0,
		borderBottomWidth: 1,
		borderColor: COLOR_BORDER,
		overflow: 'hidden',
	}),
	image: css({
		width: '100%',
		height: '100%',
	}),

	containerInfos: css({
		justifyContent: 'center',
		display: 'flex',
		flexDirection: 'column',
		flexShrink: 1,
		flexGrow: 1,
		padding: SPACE_BASE_M,
		//height: 0
		//backgroundColor: '#f0f'
	}),
	textBase: css({
		fontWeight: '400',
		fontSize: 15,
		//lineHeight: '20px',
		textAlign: 'left',
	}),
	textUrl: css({
		color: COLOR_SUBTEXT,
	}),
	textTitle: css({
		color: COLOR_LIGHTBLACK,
	}),
	textDescription: css({
		color: COLOR_SUBTEXT,
	}),
};
