import { Box } from '@chakra-ui/react';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';

import { MouseEvent } from 'react';
import { IoMdPlay } from 'react-icons/io';
import { COLOR_LINK } from './consts';
import { t_mediaPhoto, t_mediaVideo, t_onImageGallery } from './types';

type P_thumbsContainer = {
	thumbs: t_thumb[];
	onClick: (index: number) => any;
};
type t_thumb = {
	url: string;
	isVideo: boolean;
};

//ここにモーダルを仕込むとImageGalleryが生成される度にモーダルが生成されることにならないか？モーダルの記述はここでいいから、exportして他所で呼び出すべき
export default function ImageGallery({
	medias,
	Info,
	onImageGallery,
}: {
	medias: (t_mediaPhoto | t_mediaVideo)[];
	Info?: JSX.Element;
	onImageGallery?: t_onImageGallery;
}) {
	const thumbsProps: P_thumbsContainer = pipe(
		medias,
		A.map((m) => ({
			type: m.type === 'photo' ? ('image' as const) : ('video' as const),
			src: m.type === 'photo' ? m.url : m.video_url,
			video_poster_url: m.type === 'photo' ? undefined : m.photo_url,
		})),
		(temp) => ({
			thumbs: medias.map((m) => ({
				url: m.type === 'photo' ? m.url : m.photo_url,
				isVideo: m.type === 'photo' ? false : true,
			})),
			onClick: onImageGallery
				? (index: number) => {
						onImageGallery(temp, index);
						return false;
				  }
				: () => false,
		}),
	);

	const len = medias.length;
	return (
		<Box {...CHAKRA_PROPS.container}>
			<Box {...CHAKRA_PROPS.imageContainerWrapper}>
				<Box {...CHAKRA_PROPS.imagesContainerHeight}></Box>
				{len === 1 ? (
					<One {...thumbsProps} />
				) : len === 2 ? (
					<Two {...thumbsProps} />
				) : len === 3 ? (
					<Three {...thumbsProps} />
				) : len === 4 ? (
					<Four {...thumbsProps} />
				) : (
					<></>
				)}
			</Box>
			{Info && Info}
		</Box>
	);
}

const triggerOpenLightbox =
	(index: number, onClick: (index: number) => any) => (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
		//親要素のイベントを作動させない
		//event.preventDefault();
		event.stopPropagation();
		onClick(index);
	};

function One({ thumbs, onClick }: P_thumbsContainer) {
	return (
		<Box {...CHAKRA_PROPS.imageContainer}>
			<ThumbContainer
				styles={CHAKRA_PROPS.imageContainerChild}
				onClick={triggerOpenLightbox(0, onClick)}
				thumb={thumbs[0]}
			/>
		</Box>
	);
}

function Two({ thumbs, onClick }: P_thumbsContainer) {
	return (
		<Box {...CHAKRA_PROPS.imageContainer}>
			<ThumbContainer
				styles={{ ...CHAKRA_PROPS.imageContainerChild, ...CHAKRA_PROPS.imageContainerChildLeft }}
				onClick={triggerOpenLightbox(0, onClick)}
				thumb={thumbs[0]}
			/>
			<ThumbContainer
				styles={CHAKRA_PROPS.imageContainerChild}
				onClick={triggerOpenLightbox(1, onClick)}
				thumb={thumbs[1]}
			/>
		</Box>
	);
}
function Three({ thumbs, onClick }: P_thumbsContainer) {
	return (
		<Box {...CHAKRA_PROPS.imageContainer}>
			<ThumbContainer
				styles={{ ...CHAKRA_PROPS.imageContainerChild, ...CHAKRA_PROPS.imageContainerChildLeft }}
				onClick={triggerOpenLightbox(0, onClick)}
				thumb={thumbs[0]}
			/>
			<Box {...CHAKRA_PROPS.imageContainerChild}>
				<ThumbContainer
					styles={{ ...CHAKRA_PROPS.imageContainerGrandchild, ...CHAKRA_PROPS.imageContainerGrandchildTop }}
					onClick={triggerOpenLightbox(1, onClick)}
					thumb={thumbs[1]}
				/>
				<ThumbContainer
					styles={CHAKRA_PROPS.imageContainerGrandchild}
					onClick={triggerOpenLightbox(2, onClick)}
					thumb={thumbs[2]}
				/>
			</Box>
		</Box>
	);
}
function Four({ thumbs, onClick }: P_thumbsContainer) {
	return (
		<Box {...CHAKRA_PROPS.imageContainer}>
			<Box {...CHAKRA_PROPS.imageContainerChild} {...CHAKRA_PROPS.imageContainerChildLeft}>
				<ThumbContainer
					styles={{ ...CHAKRA_PROPS.imageContainerGrandchild, ...CHAKRA_PROPS.imageContainerGrandchildTop }}
					onClick={triggerOpenLightbox(0, onClick)}
					thumb={thumbs[0]}
				/>
				<ThumbContainer
					styles={CHAKRA_PROPS.imageContainerGrandchild}
					onClick={triggerOpenLightbox(2, onClick)}
					thumb={thumbs[2]}
				/>
			</Box>
			<Box {...CHAKRA_PROPS.imageContainerChild}>
				<ThumbContainer
					styles={{ ...CHAKRA_PROPS.imageContainerGrandchild, ...CHAKRA_PROPS.imageContainerGrandchildTop }}
					onClick={triggerOpenLightbox(1, onClick)}
					thumb={thumbs[1]}
				/>
				<ThumbContainer
					styles={CHAKRA_PROPS.imageContainerGrandchild}
					onClick={triggerOpenLightbox(3, onClick)}
					thumb={thumbs[3]}
				/>
			</Box>
		</Box>
	);
}

function ThumbContainer(props: {
	styles: React.ComponentProps<typeof Box>;
	onClick: (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => any;
	thumb: t_thumb;
}) {
	const url = props.thumb.url.includes('name=') ? props.thumb.url : `${props.thumb.url}?name=360x360`;
	return (
		<Box {...props.styles} onClick={props.onClick}>
			<ImageAsBackground url={url} />
			{props.thumb.isVideo && <OverlayPlayButton />}
		</Box>
	);
}
function ImageAsBackground(props: { url: string }) {
	return <Box {...CHAKRA_PROPS.imageAsBackground} backgroundImage={`url(${props.url})`}></Box>;
}
function OverlayPlayButton() {
	return (
		<Box {...CHAKRA_PROPS.overlayContainer}>
			<Box {...CHAKRA_PROPS.playButtonBackground}>
				<IoMdPlay color={'#FFF'} size={36} style={{ width: 'calc(50% + 4px)', height: 'calc(50% + 4px)' }} />
			</Box>
		</Box>
	);
}

const CHAKRA_PROPS = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
		width: '100%',
	},
	imageContainerWrapper: {
		position: 'relative',
	},
	//高さ
	imagesContainerHeight: {
		display: 'flex',
		paddingBottom: '56.1419%',
		position: 'relative',
	},
	imageContainer: {
		display: 'flex',
		flexDirection: 'row',
		position: 'absolute',
		top: '0px',
		right: '0px',
		bottom: '0px',
		left: '0px',
		height: '100%',
		width: '100%',
	},
	//子コンテナ。1枚でも2枚でも。
	imageContainerChild: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		position: 'relative',
	},
	//↑の左側
	imageContainerChildLeft: {
		display: 'flex',
		marginRight: '2px',
		position: 'relative',
	},
	//孫コンテナ。3枚以上の時に出現。
	imageContainerGrandchild: {
		display: 'flex',
		flexGrow: 1,
		position: 'relative',
	},
	//↑の上側
	imageContainerGrandchildTop: {
		display: 'flex',
		marginBottom: '2px',
		position: 'relative',
	},
	imageAsBackground: {
		display: 'flex',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		height: '100%',
		width: '100%',
		position: 'absolute',
		top: '0px',
		right: '0px',
		bottom: '0px',
		left: '0px',
	},
	overlayContainer: {
		display: 'flex',
		position: 'absolute',
		top: '0px',
		left: '0px',
		right: '0px',
		bottom: '0px',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 2,
	},
	playButtonBackground: {
		width: '67px',
		height: '67px',
		backgroundColor: COLOR_LINK,
		borderWidth: '4px',
		borderColor: '#FFF',
		borderStyle: 'solid',
		borderRadius: '9999px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		pointerEvents: 'auto',
		paddingLeft: '3px',
	},
} as const;
