import { Box, Button } from '@chakra-ui/react';
import { HiOutlineCurrencyYen } from 'react-icons/hi2';
import { Link as ReactRouterLink } from 'react-router-dom';

export function DonationForMobile() {
	return (
		<Box>
			<Button
				leftIcon={<HiOutlineCurrencyYen />}
				variant='outline'
				colorScheme='yellow'
				size='xs'
				as={ReactRouterLink}
				to='/donation'
			>
				運営支援
			</Button>
		</Box>
	);
}
