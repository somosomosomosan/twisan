import {
	Box,
	Card,
	CardBody,
	Container,
	Heading,
	Image,
	Link,
	ListItem,
	Stack,
	Text,
	UnorderedList,
	VStack,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaClipboard } from 'react-icons/fa';
import { Link as ReactRouterLink } from 'react-router-dom';
import { COLOR_LINK, COLOR_SUBTEXT } from '../components/TweetComponent/consts';
import TouchableHighlight from '../components/utilCompos/TouchableHighlight';
import { useShowToast } from '../components/utilCompos/useShowToast';
import copyToClipboard from '../utilfuncs/copyToClipboard';

const MAIL_ADDRESS = 'twicrawlerweb@gmail.com';
const AMAZON_ADDRESS = 'https://amzn.to/458baHx';
export default function PageDonation() {
	const { onShowToast } = useShowToast();
	const onCopy = useCallback(() => {
		copyToClipboard(MAIL_ADDRESS);
		onShowToast(`コピーしました:\n${MAIL_ADDRESS}`);
	}, []);
	return (
		<div>
			<Helmet>
				<title>運営支援</title>
				<meta name='description' content={`運営支援`} />
			</Helmet>
			<Container
				maxW='100%'
				centerContent
				marginTop={4}
				marginBottom={4}
				fontFamily={`Meiryo, "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif`}
			>
				<VStack spacing={4} align='stretch'>
					<Heading as='h1' size='lg' noOfLines={1}>
						運営支援
					</Heading>
					<TouchableHighlight>
						<Link href={AMAZON_ADDRESS} target='_blank'>
							<Card
								direction={{ base: 'column', sm: 'row' }}
								overflow='hidden'
								variant='outline'
								background={'transparent'}
							>
								<Image
									objectFit='cover'
									maxW={{ base: '100%', sm: '200px' }}
									src='https://i.imgur.com/2NvFmsD.png'
									alt='Amazon Logo'
								/>

								<Stack>
									<CardBody>
										<Heading size='md'>Amazonギフト券 Eメールタイプ</Heading>

										<Text py='2'>Amazonギフト券 Eメールタイプを贈る</Text>
									</CardBody>
								</Stack>
							</Card>
						</Link>
					</TouchableHighlight>

					<Text>上記のリンクから Amazon ギフト券 E メールタイプを使ってご支援いただくことができます。</Text>
					<UnorderedList>
						<ListItem textAlign={'left'}>
							<Text>
								『受取人のEメールアドレス』は
								<Box
									display={'inline'}
									background={'#FFEECB'}
									paddingLeft={'0.25rem'}
									paddingRight={'0.25rem'}
									marginLeft={'0.25rem'}
									marginRight={'0.25rem'}
								>
									{MAIL_ADDRESS}
									<FaClipboard
										size='12px'
										style={{ display: 'inline', marginLeft: '0.25rem', cursor: 'pointer' }}
										onClick={onCopy}
									/>
								</Box>
								でお願いいたします。
							</Text>
						</ListItem>
						<ListItem textAlign={'left'}>メッセージは空でも問題ございません。</ListItem>
					</UnorderedList>
					<Text>実は家のPCをつけっぱなしにして稼働させてまして。</Text>
					<Text color={COLOR_SUBTEXT}>Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。</Text>
					<Link color={COLOR_LINK} as={ReactRouterLink} to='/smash'>
						戻る
					</Link>
				</VStack>
			</Container>
		</div>
	);
}
