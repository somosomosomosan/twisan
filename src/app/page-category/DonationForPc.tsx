import { Box, Card, CardBody, Flex, Text, VStack } from '@chakra-ui/react';
import { HiOutlineCurrencyYen } from 'react-icons/hi2';
import { Link as ReactRouterLink } from 'react-router-dom';
import { COLOR_LINK } from '../tweet-components/inners/consts';
import { SPACE_V_STACK } from './consts';

export function DonationForPc() {
	return (
		<Card textAlign={'left'} marginLeft={'24px'} width={'100%'} variant={'outline'}>
			<CardBody>
				<VStack spacing={SPACE_V_STACK} fontSize={12} align={'flex-start'}>
					<Flex
						direction={'row'}
						marginRight={4}
						alignItems={'center'}
						color={COLOR_LINK}
						as={ReactRouterLink}
						to='/donation'
					>
						<Box marginRight={1}>
							<HiOutlineCurrencyYen size={15} />
						</Box>

						<Text>運営を支援</Text>
					</Flex>
				</VStack>
			</CardBody>
		</Card>
	);
}
