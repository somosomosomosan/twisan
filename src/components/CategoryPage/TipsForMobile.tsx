import {
	Box,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from '@chakra-ui/react';
import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { Tips } from './Tips';

export function TipsForMobile() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box>
			<Button leftIcon={<MdOutlineTipsAndUpdates />} variant='outline' colorScheme='orange' size='xs' onClick={onOpen}>
				Tips
			</Button>
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent onClick={onClose}>
					<ModalHeader>Tips</ModalHeader>
					<ModalBody>
						<Tips isPc={false} />
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
}
