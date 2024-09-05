import { Card, CardBody, Link, VStack } from '@chakra-ui/react';
import { COLOR_LINK } from '../tweet-components/inners/consts';
import { MyTwitter } from './MyTwitter';
import { SPACE_V_STACK } from './consts';

export function LinksForPc() {
	return (
		<Card textAlign={'left'} marginLeft={'24px'} width={'100%'} variant={'outline'}>
			<CardBody>
				<VStack spacing={SPACE_V_STACK} fontSize={12} align={'flex-start'}>
					<Link color={COLOR_LINK} href={'https://somosomosomosan.github.io/texttoimage/'} isExternal>
						文章画像化ツール
					</Link>
					<MyTwitter />
				</VStack>
			</CardBody>
		</Card>
	);
}
