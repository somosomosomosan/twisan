import * as Rb from 'rambda';
import { MouseEvent } from 'react';
import * as Re from 'remeda';
/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from '@emotion/react';
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
	const thumbsProps: P_thumbsContainer = Re.pipe(
		medias,
		Rb.map((e) => ({
			type: e.type === 'photo' ? ('image' as const) : ('video' as const),
			src: e.type === 'photo' ? e.url : e.video_url,
			video_poster_url: e.type === 'photo' ? undefined : e.photo_url,
		})),
		(t) => ({
			thumbs: medias.map((e) => ({
				url: e.type === 'photo' ? e.url : e.photo_url,
				isVideo: e.type === 'photo' ? false : true,
			})),
			onClick: onImageGallery
				? (index: number) => {
						onImageGallery(t, index);
						return false;
				  }
				: () => false,
		}),
	);

	const len = medias.length;
	return (
		<div css={styles.container}>
			<div css={styles.imageContainerWrapper}>
				<div css={styles.imagesContainerHeight}></div>
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
			</div>
			{Info && Info}
		</div>
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
		<div css={styles.imageContainer}>
			<ThumbContainer
				styles={[styles.imageContainerChild]}
				onClick={triggerOpenLightbox(0, onClick)}
				thumb={thumbs[0]}
			/>
		</div>
	);
}

function Two({ thumbs, onClick }: P_thumbsContainer) {
	return (
		<div css={styles.imageContainer}>
			<ThumbContainer
				styles={[styles.imageContainerChild, styles.imageContainerChildLeft]}
				onClick={triggerOpenLightbox(0, onClick)}
				thumb={thumbs[0]}
			/>
			<ThumbContainer
				styles={[styles.imageContainerChild]}
				onClick={triggerOpenLightbox(1, onClick)}
				thumb={thumbs[1]}
			/>
		</div>
	);
}
function Three({ thumbs, onClick }: P_thumbsContainer) {
	return (
		<div css={styles.imageContainer}>
			<ThumbContainer
				styles={[styles.imageContainerChild, styles.imageContainerChildLeft]}
				onClick={triggerOpenLightbox(0, onClick)}
				thumb={thumbs[0]}
			/>
			<div css={styles.imageContainerChild}>
				<ThumbContainer
					styles={[styles.imageContainerGrandchild, styles.imageContainerGrandchildTop]}
					onClick={triggerOpenLightbox(1, onClick)}
					thumb={thumbs[1]}
				/>
				<ThumbContainer
					styles={[styles.imageContainerGrandchild]}
					onClick={triggerOpenLightbox(2, onClick)}
					thumb={thumbs[2]}
				/>
			</div>
		</div>
	);
}
function Four({ thumbs, onClick }: P_thumbsContainer) {
	return (
		<div css={styles.imageContainer}>
			<div css={[styles.imageContainerChild, styles.imageContainerChildLeft]}>
				<ThumbContainer
					styles={[styles.imageContainerGrandchild, styles.imageContainerGrandchildTop]}
					onClick={triggerOpenLightbox(0, onClick)}
					thumb={thumbs[0]}
				/>
				<ThumbContainer
					styles={[styles.imageContainerGrandchild]}
					onClick={triggerOpenLightbox(2, onClick)}
					thumb={thumbs[2]}
				/>
			</div>
			<div css={styles.imageContainerChild}>
				<ThumbContainer
					styles={[styles.imageContainerGrandchild, styles.imageContainerGrandchildTop]}
					onClick={triggerOpenLightbox(1, onClick)}
					thumb={thumbs[1]}
				/>
				<ThumbContainer
					styles={[styles.imageContainerGrandchild]}
					onClick={triggerOpenLightbox(3, onClick)}
					thumb={thumbs[3]}
				/>
			</div>
		</div>
	);
}

function ThumbContainer(props: {
	styles: SerializedStyles[];
	onClick: (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => any;
	thumb: t_thumb;
}) {
	const url = props.thumb.url.includes('name=') ? props.thumb.url : `${props.thumb.url}?name=360x360`;
	return (
		<div css={props.styles} onClick={props.onClick}>
			<ImageAsBackground url={url} />
			{props.thumb.isVideo && <OverlayPlayButton />}
		</div>
	);
}
function ImageAsBackground(props: { url: string }) {
	return <div style={{ backgroundImage: `url(${props.url})` }} css={styles.imageAsBackground}></div>;
}
function OverlayPlayButton() {
	return (
		<div css={styles.overlayContainer}>
			<div css={styles.playButtonBackground}>
				<IoMdPlay color={'#FFF'} size={36} style={{ width: 'calc(50% + 4px)', height: 'calc(50% + 4px)' }} />
			</div>
		</div>
	);
}

const styles = {
	container: css({
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
		width: '100%',
	}),
	imageContainerWrapper: css({
		position: 'relative',
	}),
	//高さ
	imagesContainerHeight: css({
		display: 'flex',
		paddingBottom: '56.1419%',
		position: 'relative',
		//width: '100%',
	}),
	imageContainer: css({
		display: 'flex',
		flexDirection: 'row',
		position: 'absolute',
		top: '0px',
		right: '0px',
		bottom: '0px',
		left: '0px',
		height: '100%',
		width: '100%',
	}),
	//子コンテナ。1枚でも2枚でも。
	imageContainerChild: css({
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		position: 'relative',
	}),
	//↑の左側
	imageContainerChildLeft: css({
		display: 'flex',
		marginRight: 2,
		position: 'relative',
	}),
	//孫コンテナ。3枚以上の時に出現。
	imageContainerGrandchild: css({
		display: 'flex',
		flexGrow: 1,
		position: 'relative',
	}),
	//↑の上側
	imageContainerGrandchildTop: css({
		display: 'flex',
		marginBottom: 2,
		position: 'relative',
	}),
	imageAsBackground: css({
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
	}),
	overlayContainer: css({
		display: 'flex',
		position: 'absolute',
		top: '0px',
		left: '0px',
		right: '0px',
		bottom: '0px',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 2,
	}),
	playButtonBackground: css({
		width: 67,
		height: 67,
		backgroundColor: COLOR_LINK,
		borderWidth: 4,
		borderColor: '#FFF',
		borderStyle: 'solid',
		borderRadius: 9999,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		pointerEvents: 'auto',
		paddingLeft: '3px',
	}),
};
