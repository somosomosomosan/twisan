import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { PATH_ASSETS } from '../../consts';
import { generateTweetUrl } from '../../utilfuncs/generateTweetUrl';
import { DUMMY_TWEET } from '../TweetList/TweetComponentList';
import Avatar from './Avatar';
import CardLink from './CardLink';
import CreatedAt from './CreatedAt';
import ImageGallery from './ImageGallery';
import { MainTextM, MainTextS } from './MainText';
import { Name, NameAndScreenName, ScreenName } from './Name';
import Poll from './Poll';
import PublicMetrics from './PublicMetrics';
import ToTweetButton from './ToTweetButton';
import { COLOR_BG_IN_DARKMODE, COLOR_BORDER } from './consts';
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
	const { text, created_at, others, tweet_id, likes, retweets, quotes, replies } =
		turnTweetDataIntoDummyIfTheAuthorIsProtected(props.tweetData, props.authorData);
	return (
		<Box as={'blockquote'}>
			{repId && (
				<RepliedContainer
					tweetId={repId}
					conversationId={others.conversation_id}
					loadAuthorData={props.loadAuthorData}
					loadTweetData={props.loadTweetData}
					onImageGallery={props.onImageGallery}
					noMedias={props.noMedias}
				/>
			)}
			<Box>
				{repId && <ParentReplyBorder />}
				{/* 最上部コンテナ 投稿者情報など */}
				<TopContainer marginBottom={true}>
					{/* アバター */}
					<Box marginRight={'12px'}>
						<Avatar
							url={props.noMedias ? DUMMY_AVATAR : props.authorData.profile_image_url}
							size={'M'}
							fallbackPicUrl={DUMMY_AVATAR}
						/>
					</Box>
					{/* 名前 */}
					<AuthorInfoTextContainer2Col
						name={props.authorData.name}
						verified={props.authorData.verified}
						screenName={props.authorData.screen_name}
					/>
				</TopContainer>
				{/* <p>{tweet_id}</p> */}

				{/* 本文 */}
				<MainTextContainer text={text} urls={others.urls} size={'M'} marginVertical={false} />
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
				{qtId && (
					<QuotedContainer
						tweetId={qtId}
						loadAuthorData={props.loadAuthorData}
						loadTweetData={props.loadTweetData}
						onImageGallery={props.onImageGallery}
						noMedias={props.noMedias}
					/>
				)}
				<BottomContainer createdAt={created_at} likes={likes} retweets={retweets} quotes={quotes} replies={replies} />
				<ToTweetButton url={generateTweetUrl(props.authorData.screen_name, tweet_id)} />
			</Box>
		</Box>
	);
}

function QuotedContainer(props: {
	tweetId: string;
	loadAuthorData: (authorId: string) => t_dbAuthor;
	loadTweetData: (tweetId: string) => t_dbTweetDataParsed;
	onImageGallery: t_onImageGallery;
	noMedias: boolean;
}) {
	const bgColor = useColorModeValue('#FFFFFF', COLOR_BG_IN_DARKMODE);
	const tweetData = props.loadTweetData(props.tweetId);
	const authorData = props.loadAuthorData(tweetData.author_id);
	const { name, screen_name, profile_image_url, verified } = authorData;
	const { text, created_at, others, tweet_id } = turnTweetDataIntoDummyIfTheAuthorIsProtected(tweetData, authorData);

	return (
		<Flex
			direction='column'
			backgroundColor={bgColor}
			{...CHAKRA_PROPS.attachmentContainer}
			{...CHAKRA_PROPS.attachmentContainerBorder}
		>
			<Box padding={`12px 12px 0 12px`}>
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
			</Box>
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
		</Flex>
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
	conversationId?: string;
	loadAuthorData: (authorId: string) => t_dbAuthor;
	loadTweetData: (tweetId: string) => t_dbTweetDataParsed;
	onImageGallery: t_onImageGallery;
	noMedias: boolean;
}) {
	const _loadTweetData = (): t_dbTweetDataParsed => {
		const rep = props.loadTweetData(props.tweetId);
		if (rep.tweet_id !== '0') {
			return rep;
		}
		//console.log('conversation! - ' + props.conversationId);
		return props.loadTweetData(props.conversationId ?? '');
	};

	const tweetData = _loadTweetData();
	if (tweetData.tweet_id === '0') {
		return null;
	}
	const authorData = props.loadAuthorData(tweetData.author_id);
	const { name, screen_name, profile_image_url, verified } = authorData;
	const { text, created_at, others, tweet_id } = turnTweetDataIntoDummyIfTheAuthorIsProtected(tweetData, authorData);
	const qtId = getQtId(tweetData);

	return (
		<Flex direction={'row'}>
			<Flex direction={'column'}>
				<Avatar url={props.noMedias ? DUMMY_AVATAR : profile_image_url} size={'M'} fallbackPicUrl={DUMMY_AVATAR} />
				<Flex
					grow={1}
					backgroundColor={COLOR_BORDER}
					width={'2px'}
					minHeight={'10ox'}
					marginTop={'4px'}
					marginRight={'auto'}
					marginLeft={'auto'}
				></Flex>
			</Flex>

			<Flex direction={'column'} grow={7} basis={0} marginLeft={'4px'} marginBottom={'12px'}>
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
			</Flex>
		</Flex>
	);
}

function TopContainer(props: { children: React.ReactNode; marginBottom?: boolean }) {
	return (
		<Flex direction={'row'} align={'center'} marginBottom={props.marginBottom ? '4px' : undefined}>
			{props.children}
		</Flex>
	);
}

function AuthorInfoTextContainer2Col(props: { name: string; screenName: string; verified?: boolean }) {
	const { name, screenName, verified } = props;
	return (
		<Flex direction={'column'} justify={'center'} margin={`0 4px 2px`}>
			<Name name={name} verified={verified} />
			<ScreenName screenName={screenName} />
		</Flex>
	);
}

const AuthorInfoTextContainer1Col = (props: {
	name: string;
	screenName: string;
	verified?: boolean;
	createdAt: string;
}) => {
	const { name, screenName, verified, createdAt } = props;
	return (
		<Flex direction={'row'} width={'100%'} marginLeft={'4px'}>
			<Flex direction={'row'} shrink={1} maxW={'70%'} overflow={'hidden'}>
				<NameAndScreenName name={name} verified={verified} screenName={screenName} />
			</Flex>
			<span>&nbsp;·&nbsp;</span>
			<CreatedAt createdAt={createdAt} includeTime={false} />
		</Flex>
	);
};

function MainTextContainer(props: { text: string; size: 'S' | 'M'; urls?: t_urls[]; marginVertical: boolean }) {
	const { text, size, urls, marginVertical } = props;
	const _marginVertical = marginVertical && {
		marginBottom: '12px',
		marginTop: '4px',
	};
	return (
		<Box {..._marginVertical}>
			{size === 'S' ? <MainTextS text={text} urls={urls} /> : <MainTextM text={text} urls={urls} />}
		</Box>
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

	const borderStyle = border ? CHAKRA_PROPS.attachmentContainerBorder : {};
	const marginTopStyle = marginTop ? CHAKRA_PROPS.attachmentContainer : {};
	if (polls && polls.length > 0) {
		return (
			<Box {...marginTopStyle}>
				<Poll polls={polls} />
			</Box>
		);
	}

	if (medias && medias.length > 0) {
		return (
			<Box {...borderStyle} {...marginTopStyle}>
				<ImageGallery medias={noMedias ? replaceMediasDummies(medias) : medias} onImageGallery={onImageGallery} />
			</Box>
		);
	}

	if (cardLink && cardLink.photo_url) {
		return (
			<Box {...borderStyle} {...marginTopStyle}>
				<CardLink {...cardLink} photo_url={noMedias ? DUMMY_PICTURE : cardLink.photo_url} />
			</Box>
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
		<Flex direction={'row'} justify={'space-between'} align={'baseline'} marginTop={'12px'}>
			<PublicMetrics likes={props.likes} retweets={props.retweets} quotes={props.quotes} replies={props.replies} />
			<CreatedAt createdAt={props.createdAt} includeTime={true} />
		</Flex>
	);
}

/**
 * 親コンテナ用、リプライから伸びてきたボーダー
 * @param props
 * @returns
 */
function ParentReplyBorder() {
	return (
		<Flex direction={'row'}>
			<Flex direction={'row'} basis={'40px'} grow={0} marginRight={'12px'} marginBottom={'4px'} position={'relative'}>
				<Box
					width={'2px'}
					backgroundColor={'rgb(207, 217, 222)'}
					position={'absolute'}
					top={0}
					bottom={0}
					right={0}
					left={0}
					marginLeft={'auto'}
					marginRight={'auto'}
				></Box>
			</Flex>
			<Flex direction={'row'} basis={0} grow={1} paddingTop={'12px'}></Flex>
		</Flex>
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

function turnTweetDataIntoDummyIfTheAuthorIsProtected(
	tweetData: t_dbTweetDataParsed,
	authorData: t_dbAuthor,
): t_dbTweetDataParsed {
	return authorData.protected
		? {
				...tweetData,
				text: DUMMY_TWEET.text,
				others: {
					urls: undefined,
					card_link: undefined,
					medias: undefined,
					polls: undefined,
				},
		  }
		: tweetData;
}

const CHAKRA_PROPS = {
	attachmentContainer: {
		marginTop: '12px',
	},
	attachmentContainerBorder: {
		borderRadius: '16px',
		borderWidth: '1px',
		borderStyle: 'solid',
		borderColor: COLOR_BORDER,
		overflow: 'hidden',
		position: 'relative',
	},
} as const;
