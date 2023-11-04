import { Box, Flex } from '@chakra-ui/react';
import { MdVerified } from 'react-icons/md';
import NoEscapeChakraText from '../utilCompos/NoEscapeChakraText';
import { COLOR_LINK, SIZE_TEXT_S } from './consts';

type P_name = {
	name: string;
	verified?: boolean;
};
export function Name(props: P_name) {
	return (
		<Flex direction={'row'} align={'center'} minW={'1rem'}>
			<NoEscapeChakraText
				text={props.name}
				chakraProps={{
					className: 'mainText',
					fontSize: `${SIZE_TEXT_S}px`,
					fontWeight: 'bold',
					noOfLines: 1,
				}}
			/>
			{props.verified && <VerifiedComponent />}
		</Flex>
	);
}

type P_screenName = {
	screenName: string;
	separator?: boolean;
};
export function ScreenName(props: P_screenName) {
	return (
		<NoEscapeChakraText
			text={`@${props.screenName}`}
			chakraProps={{
				className: 'subText',
				fontSize: `${SIZE_TEXT_S}px`,
				textAlign: 'left',
				marginLeft: props.separator ? '4px' : undefined,
				noOfLines: 1,
			}}
		/>
	);
}

type P_nameAndUsername = P_name & P_screenName;
/**
 * 名前とスクリーンネームを一列で。
 */
export function NameAndScreenName(props: Omit<P_nameAndUsername, 'separator'>) {
	return (
		<Flex direction={'row'}>
			<Name name={props.name} verified={props.verified} />
			<ScreenName screenName={props.screenName} separator={true} />
		</Flex>
	);
}

function VerifiedComponent() {
	return (
		<Box marginLeft={'2px'}>
			<MdVerified size={SIZE_TEXT_S} color={COLOR_LINK} />
		</Box>
	);
}
