import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TweetComponentList from '../../../components/TweetList/TweetComponentList';
import { getRankingData, t_dataRanking } from '../../../utilfuncs/getRankingData';

export default function PageSmash() {
	const [state_dataRanking, set_dataRanking] = useState<t_dataRanking>();
	useEffect(() => {
		const a = async () => {
			console.log('useeffect');
			set_dataRanking(await getRankingData('smash'));
		};
		a();
	}, []);
	if (!state_dataRanking) {
		return <></>;
	}
	return (
		<div>
			<p>すまぶら</p>
			<VerticallyCenter />
			<Link to={'/'}>ホーム</Link>
			<TweetComponentList {...state_dataRanking} ngAccounts={[]} readTweets={[]} />
		</div>
	);
}

function VerticallyCenter() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Button onClick={onOpen}>Trigger modal</Button>

			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Modal Title</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<p>uhyohyo</p>
						<p>uhyohyo</p>
					</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
