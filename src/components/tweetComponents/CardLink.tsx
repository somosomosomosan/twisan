import { Box, Card, CardBody, Image, Stack, Text } from '@chakra-ui/react';
import { MouseEvent } from 'react';
import NoEscapeChakraText from '../utilCompos/NoEscapeChakraText';
import TouchableHighlight from '../utilCompos/TouchableHighlight';
import ImageGallery from './ImageGallery';
import { COLOR_BORDER, COLOR_LIGHTBLACK } from './consts';
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
				onClick: (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
					event.stopPropagation();
					window.open(props.url);
				},
			}}
		>
			<Card
				direction={{ base: 'column', sm: 'row' }}
				maxH={{ base: '100%', sm: '130px' }}
				overflow='hidden'
				variant='outline'
			>
				<Image objectFit='cover' maxW={{ base: '100%', sm: '130px' }} src={props.photo_url} />
				<Stack>
					<CardBody padding={0} display={'flex'}>
						<CardInfo url={props.domain} description={props.description} title={props.title} />
					</CardBody>
				</Stack>
			</Card>
		</TouchableHighlight>
	);
}
/*
		<TouchableHighlight
			boxProps={{
				onClick: () => {
					window.open(props.url);
				},
			}}
		>
			<Box {...CHAKRA_PROPS.containerPrimalSmallSquare}>
				<Box {...CHAKRA_PROPS.containerImageSmallSquare}>
					<Image htmlWidth='100%' htmlHeight={'100%'} src={props.photo_url} />
				</Box>
				<CardInfo url={props.domain} description={props.description} title={props.title} />
			</Box>
		</TouchableHighlight>
*/

function CardLarge(props: t_cardLink) {
	return (
		<TouchableHighlight
			boxProps={{
				onClick: (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
					event.stopPropagation();
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
		<Box {...CHAKRA_PROPS.containerInfos}>
			<Text className='subText' {...CHAKRA_PROPS.textBase} noOfLines={1}>
				{props.url}
			</Text>
			<NoEscapeChakraText
				text={props.title ?? ''}
				chakraProps={{
					...CHAKRA_PROPS.textBase,
					...CHAKRA_PROPS.textTitle,
					noOfLines: 1,
				}}
			/>
			<NoEscapeChakraText
				text={props.description ?? ''}
				chakraProps={{
					...CHAKRA_PROPS.textBase,
					noOfLines: 2,
					className: 'subText',
				}}
			/>
		</Box>
	);
}

const CHAKRA_PROPS = {
	//大親コンテナ 正方形イメージタイプ
	containerPrimalSmallSquare: {
		display: 'flex',
		flexDirection: 'row',
	},
	//画像コンテナ 正方形イメージタイプ
	containerImageSmallSquare: {
		width: '130px',
		//height: '130px',
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
		borderRightWidth: '1px',
		borderColor: COLOR_BORDER,
		overflow: 'hidden',
	},
	//画像コンテナ 正方形イメージタイプ
	containerImageLarge: {
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0,
		borderBottomWidth: '1px',
		borderColor: COLOR_BORDER,
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	containerInfos: {
		justifyContent: 'center',
		display: 'flex',
		flexDirection: 'column',
		flexShrink: 1,
		flexGrow: 1,
		padding: '12px',
		//height: 0
		//backgroundColor: '#f0f'
	},
	textBase: {
		fontWeight: '400',
		fontSize: '15px',
		//lineHeight: '20px',
		textAlign: 'left',
	},
	textTitle: {
		color: COLOR_LIGHTBLACK,
	},
} as const;
