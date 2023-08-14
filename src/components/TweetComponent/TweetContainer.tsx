import CreatedAt from './CreatedAt';
import ImageGallery from './ImageGallery';
import PublicMetrics from './PublicMetrics';
import { COLOR_BORDER, SPACE_BASE, SPACE_BASE_M } from './consts';
import {
	t_cardLink,
	t_dbAuthor,
	t_dbTweetDataParsed,
	t_mediaPhoto,
	t_mediaVideo,
	t_onImageGallery,
	t_poll,
	t_urls,
} from './types';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { PATH_ASSETS } from '../../consts';
import { generateTweetUrl } from '../../utilfuncs/generateTweetUrl';
import Avatar from './Avatar';
import CardLink from './CardLink';
import { MainTextM, MainTextS } from './MainText';
import { Name, NameAndScreenName, ScreenName } from './Name';
import Poll from './Poll';
import ToTweetButton from './ToTweetButton';

const DUMMY_AVATAR = `${PATH_ASSETS}/default_avatar.png`;
const DUMMY_PICTURE = `${PATH_ASSETS}/dummy_icon_picture.png`;
//const DUMMY_MOVIE = `${PATH_ASSETS}/dummy_icon_movie.png`;

export default function TweetContainer(props: {
	authorData: t_dbAuthor;
	tweetData: t_dbTweetDataParsed;
	loadAuthorData: (authorId: string) => t_dbAuthor;
	loadTweetData: (tweetId: string) => t_dbTweetDataParsed;
	onImageGallery: t_onImageGallery;
	noMedias: boolean;
}) {
	const repId = getRepliedId(props.tweetData);
	const qtId = getQtId(props.tweetData);
	return (
		<blockquote css={styles.container}>
			{repId && (
				<RepliedContainer
					tweetId={repId}
					loadAuthorData={props.loadAuthorData}
					loadTweetData={props.loadTweetData}
					onImageGallery={props.onImageGallery}
					noMedias={props.noMedias}
				/>
			)}
			<div css={styles.parentContainer}>
				{repId && <ParentReplyBorder />}
				{/* 最上部コンテナ 投稿者情報など */}
				<TopContainer marginBottom={true}>
					{/* アバター */}
					<div css={styles.avatarWrapper}>
						<Avatar
							url={props.noMedias ? DUMMY_AVATAR : props.authorData.profile_image_url}
							size={'M'}
							fallbackPicUrl={DUMMY_AVATAR}
						/>
					</div>
					{/* 名前 */}
					<AuthorInfoTextContainer2Col
						name={props.authorData.name}
						verified={props.authorData.verified}
						screenName={props.authorData.screen_name}
					/>
				</TopContainer>
				{/* <p>{props.tweetData.tweet_id}</p> */}

				{/* 本文 */}
				<MainTextContainer
					text={props.tweetData.text}
					urls={props.tweetData.others.urls}
					size={'M'}
					marginVertical={false}
				/>
				{/* アタッチメント */}
				<AttachmentContainer
					medias={props.tweetData.others.medias}
					polls={props.tweetData.others.polls}
					cardLink={props.tweetData.others.card_link}
					border={true}
					marginTop={true}
					onImageGallery={props.onImageGallery}
					noMedias={props.noMedias}
				/>
				{qtId && (
					<QuotedContainer
						tweetId={qtId}
						loadAuthorData={props.loadAuthorData}
						loadTweetData={props.loadTweetData}
						onImageGallery={props.onImageGallery}
						noMedias={props.noMedias}
					/>
				)}
				<BottomContainer
					createdAt={props.tweetData.created_at}
					likes={props.tweetData.likes}
					retweets={props.tweetData.retweets}
					quotes={props.tweetData.quotes}
					replies={props.tweetData.replies}
				/>
				<ToTweetButton url={generateTweetUrl(props.authorData.screen_name, props.tweetData.tweet_id)} />
			</div>
		</blockquote>
	);
}

function QuotedContainer(props: {
	tweetId: string;
	loadAuthorData: (authorId: string) => t_dbAuthor;
	loadTweetData: (tweetId: string) => t_dbTweetDataParsed;
	onImageGallery: t_onImageGallery;
	noMedias: boolean;
}) {
	const tweetData = props.loadTweetData(props.tweetId);
	if (tweetData.tweet_id === '0') {
		return null;
	}
	const { text, created_at, others, tweet_id } = tweetData;
	const authorData = props.loadAuthorData(tweetData.author_id);
	const { name, screen_name, profile_image_url, verified } = authorData;

	return (
		<div css={[styles.attachmentContainer, styles.attachmentContainerBorder, styles.quoteContainer]}>
			<div css={styles.quoteBodyContainer}>
				{/* 最上部コンテナ 投稿者情報など */}
				<TopContainer>
					{/* アバター */}
					<Avatar url={props.noMedias ? DUMMY_AVATAR : profile_image_url} size={'S'} fallbackPicUrl={DUMMY_AVATAR} />
					{/* 名前、投稿時間 */}
					<AuthorInfoTextContainer1Col
						name={name}
						screenName={screen_name}
						verified={verified}
						createdAt={created_at}
					/>
				</TopContainer>

				{/* <p>QT!</p> */}
				{/* 本文 */}
				<MainTextContainer text={text} size={'S'} urls={others.urls} marginVertical={true} />
			</div>
			{/* アタッチメント 引用RTと他ではアタッチメントの表示の仕方が異なる*/}
			<AttachmentContainer
				medias={others.medias}
				polls={others.polls}
				cardLink={others.card_link}
				border={true}
				marginTop={false}
				onImageGallery={props.onImageGallery}
				noMedias={props.noMedias}
			/>
		</div>
	);
}

/**
 * 
 * リプライ先データが無い事がある（長く続いてる会話など）
リプライ先データが無い場合はダミーデータは使わず普通に無いものとして扱う
 * @param props 
 * @returns 
 */
function RepliedContainer(props: {
	tweetId: string;
	loadAuthorData: (authorId: string) => t_dbAuthor;
	loadTweetData: (tweetId: string) => t_dbTweetDataParsed;
	onImageGallery: t_onImageGallery;
	noMedias: boolean;
}) {
	const tweetData = props.loadTweetData(props.tweetId);
	if (tweetData.tweet_id === '0') {
		return null;
	}
	const { text, created_at, others, tweet_id } = tweetData;
	const authorData = props.loadAuthorData(tweetData.author_id);
	const { name, screen_name, profile_image_url, verified } = authorData;
	const qtId = getQtId(tweetData);

	return (
		<div css={[styles.parentContainer, flexRow]}>
			<div css={flexCol}>
				<Avatar url={props.noMedias ? DUMMY_AVATAR : profile_image_url} size={'M'} fallbackPicUrl={DUMMY_AVATAR} />
				<div css={styles.reply2RowLeftBorder}></div>
			</div>

			<div css={styles.replay2RowRightContainer}>
				<TopContainer>
					{/* 名前、投稿時間 */}
					<AuthorInfoTextContainer1Col
						name={name}
						screenName={screen_name}
						verified={verified}
						createdAt={created_at}
					/>
				</TopContainer>

				{/*<p>Replied!</p>*/}
				{/* 本文 */}
				<MainTextContainer text={text} size={'S'} urls={others.urls} marginVertical={false} />
				{/* アタッチメント */}
				<AttachmentContainer
					medias={others.medias}
					polls={others.polls}
					cardLink={others.card_link}
					border={true}
					marginTop={true}
					onImageGallery={props.onImageGallery}
					noMedias={props.noMedias}
				/>
				{/* 引用RT */}
				{qtId && (
					<QuotedContainer
						tweetId={qtId}
						loadAuthorData={props.loadAuthorData}
						loadTweetData={props.loadTweetData}
						onImageGallery={props.onImageGallery}
						noMedias={props.noMedias}
					/>
				)}
				<BottomContainer
					createdAt={tweetData.created_at}
					likes={tweetData.likes}
					retweets={tweetData.retweets}
					quotes={tweetData.quotes}
					replies={tweetData.replies}
				/>
			</div>
		</div>
	);
}

function TopContainer(props: { children: React.ReactNode; marginBottom?: boolean }) {
	const marginBottom = props.marginBottom && { marginBottom: SPACE_BASE / 2 };
	return <div css={[styles.topContainer, marginBottom]}>{props.children}</div>;
}

function AuthorInfoTextContainer2Col(props: { name: string; screenName: string; verified: boolean }) {
	const { name, screenName, verified } = props;
	return (
		<div css={styles.tweetNameContainer2Col}>
			<Name name={name} verified={verified} />
			<ScreenName screenName={screenName} />
		</div>
	);
}

const AuthorInfoTextContainer1Col = (props: {
	name: string;
	screenName: string;
	verified: boolean;
	createdAt: string;
}) => {
	const { name, screenName, verified, createdAt } = props;
	return (
		<div css={[styles.nameCreatedAtContainer]}>
			<div css={styles.nameContainer1Col}>
				<NameAndScreenName name={name} verified={verified} screenName={screenName} />
			</div>
			<span>&nbsp;·&nbsp;</span>
			<CreatedAt createdAt={createdAt} includeTime={false} />
		</div>
	);
};

function MainTextContainer(props: { text: string; size: 'S' | 'M'; urls?: t_urls[]; marginVertical: boolean }) {
	const { text, size, urls, marginVertical } = props;
	const _marginVertical = marginVertical && {
		marginBottom: SPACE_BASE_M,
		marginTop: SPACE_BASE / 2,
	};
	return (
		<div css={_marginVertical}>
			{size === 'S' ? <MainTextS text={text} urls={urls} /> : <MainTextM text={text} urls={urls} />}
		</div>
	);
}

function AttachmentContainer(props: {
	polls: t_poll[] | undefined;
	medias: (t_mediaPhoto | t_mediaVideo)[] | undefined;
	cardLink: t_cardLink | undefined;
	border: boolean;
	marginTop: boolean;
	onImageGallery: t_onImageGallery;
	noMedias: boolean;
}) {
	const { medias, polls, cardLink, border, marginTop, noMedias } = props;
	const onImageGallery = noMedias ? () => 0 : props.onImageGallery;

	const borderStyle = border ? styles.attachmentContainerBorder : {};
	const marginTopStyle = marginTop ? styles.attachmentContainer : {};
	if (polls && polls.length > 0) {
		return (
			<div css={marginTopStyle}>
				<Poll polls={polls} />
			</div>
		);
	}

	if (medias && medias.length > 0) {
		return (
			<div css={[borderStyle, marginTopStyle]}>
				<ImageGallery medias={noMedias ? replaceMediasDummies(medias) : medias} onImageGallery={onImageGallery} />
			</div>
		);
	}

	if (cardLink && cardLink.photo_url) {
		return (
			<div css={[borderStyle, marginTopStyle]}>
				<CardLink {...cardLink} photo_url={noMedias ? DUMMY_PICTURE : cardLink.photo_url} />
			</div>
		);
	}
	return null;
}

function BottomContainer(props: {
	likes: number;
	retweets: number;
	quotes: number;
	replies: number;
	createdAt: string;
}) {
	return (
		<div css={styles.bottomContainer}>
			<PublicMetrics likes={props.likes} retweets={props.retweets} quotes={props.quotes} replies={props.replies} />
			<CreatedAt createdAt={props.createdAt} includeTime={true} />
		</div>
	);
}

/**
 * 親コンテナ用、リプライから伸びてきたボーダー
 * @param props
 * @returns
 */
function ParentReplyBorder() {
	return (
		<div css={flexRow}>
			<div
				css={css`
					display: flex;
					flex-basis: 40px;
					flex-grow: 0;
					margin-right: 12px;
					margin-bottom: 4px;
					position: relative;
				`}
			>
				<div
					css={css`
						width: 2px;
						background-color: rgb(207, 217, 222);
						position: absolute;
						top: 0;
						bottom: 0;
						right: 0;
						left: 0;
						margin-left: auto;
						margin-right: auto;
					`}
				></div>
			</div>
			<div
				css={css`
					padding-top: 12px;
					display: flex;
					flex-basis: 0;
					flex-grow: 1;
				`}
			></div>
		</div>
	);
}

function getRepliedId(tweetData: t_dbTweetDataParsed): string | undefined {
	return tweetData.others.replied_tweet_id;
}
function getQtId(tweetData: t_dbTweetDataParsed): string | undefined {
	return tweetData.others.quoted_tweet_id;
}

function replaceMediasDummies(medias: (t_mediaPhoto | t_mediaVideo)[]): (t_mediaPhoto | t_mediaVideo)[] {
	return medias.map((e) => (e.type === 'photo' ? { ...e, url: DUMMY_PICTURE } : { ...e, photo_url: DUMMY_PICTURE }));
}

const flexRow = css({ display: 'flex', flexDirection: 'row' });
const flexCol = css({ display: 'flex', flexDirection: 'column' });
const styles = {
	container: css({
		/*
		backgroundColor: '#FFF',
		border: '1px solid #eee',
		borderRadius: '0.5rem',
		padding: '1rem',
		*/
	}),
	parentContainer: css({
		//paddingLeft: SPACE_BASE * 2,
		//paddingRight: SPACE_BASE * 2,
	}),

	reply2RowLeftBorder: css({
		width: 2,
		minHeight: 10,
		marginVertical: 4,
		display: 'flex',
		flexGrow: 1,
		backgroundColor: COLOR_BORDER,
		marginRight: 'auto',
		marginLeft: 'auto',
	}),
	replay2RowRightContainer: css([
		flexCol,
		{
			marginLeft: SPACE_BASE / 2,
			marginBottom: SPACE_BASE_M,
			flexGrow: 7,
			flexBasis: 0,
		},
	]),
	topContainer: css([
		flexRow,
		{
			alignItems: 'center',
		},
	]),
	tweetNameContainer2Col: css([
		flexCol,
		{
			justifyContent: 'center',
			margin: `0 ${SPACE_BASE / 2}px 2px`,
		},
	]),
	avatarWrapper: css({
		marginRight: SPACE_BASE_M,
	}),
	nameCreatedAtContainer: css([
		flexRow,
		{
			width: '100%',
			marginLeft: SPACE_BASE / 2,
		},
	]),
	nameContainer1Col: css({
		display: 'flex',
		flexShrink: 1,
		maxWidth: '70%',
		overflow: 'hidden',
	}),
	attachmentContainer: css({
		marginTop: SPACE_BASE_M,
	}),
	attachmentContainerBorder: css({
		borderRadius: 16,
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: COLOR_BORDER,
		overflow: 'hidden',
		position: 'relative',
	}),
	quoteContainer: css([
		flexCol,
		{
			backgroundColor: '#FFF',
		},
	]),
	quoteBodyContainer: css({
		padding: `${SPACE_BASE_M}px ${SPACE_BASE_M}px 0 ${SPACE_BASE_M}px`,
	}),
	bottomContainer: css([
		flexRow,
		{
			justifyContent: 'space-between',
			alignItems: 'baseline',
			marginTop: SPACE_BASE_M,
		},
	]),
	publicMetricsContainer: css([
		flexRow,
		{
			flexWrap: 'nowrap',
			paddingBottom: SPACE_BASE / 2,
		},
	]),
};
