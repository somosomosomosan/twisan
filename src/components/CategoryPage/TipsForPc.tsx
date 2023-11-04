import { Card, CardBody, Center, VStack } from '@chakra-ui/react';
import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { Tips } from './Tips';

export function TipsForPc() {
	return (
		<Card textAlign={'left'} marginLeft={'24px'} width={'100%'} variant={'outline'}>
			<CardBody>
				<VStack spacing={2}>
					<Center>
						<MdOutlineTipsAndUpdates size={32} />
					</Center>
					<Tips isPc={true} />
				</VStack>
			</CardBody>
		</Card>
	);
}
