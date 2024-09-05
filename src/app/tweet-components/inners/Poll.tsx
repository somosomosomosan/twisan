import { Box, Flex, Text } from '@chakra-ui/react';
import NoEscapeChakraText from '../../util-compos/NoEscapeChakraText';
import { COLOR_LIGHTBLACK } from './consts';
import { t_poll } from './types';

export default function Poll(props: { polls: t_poll[] }) {
	return (
		<Flex direction={'column'} grow={1} width='100%'>
			{props.polls.map((e, i) => (
				<Flex
					key={i}
					direction={'row'}
					justify={'space-between'}
					align={'center'}
					height={'32px'}
					position={'relative'}
					marginTop={i === 0 ? undefined : '4px'}
				>
					<Box
						width={'7px'}
						backgroundColor={'rgba(29, 155, 240, 0.58)'}
						borderBottomLeftRadius={'4px'}
						borderTopLeftRadius={'4px'}
						position={'absolute'}
						top={0}
						left={0}
						right={0}
						bottom={0}
					></Box>
					<Box paddingLeft={'12px'} paddingRight={'12px'} width={'80%'} textAlign={'left'}>
						<NoEscapeChakraText
							text={e.label}
							chakraProps={{
								...CHAKRA_PROPS_POLL_TEXT,
								noOfLines: 1,
							}}
						/>
					</Box>
					<Box paddingLeft={'12px'}>
						<Text {...CHAKRA_PROPS_POLL_TEXT}>{e.votes}</Text>
					</Box>
				</Flex>
			))}
		</Flex>
	);
}

const CHAKRA_PROPS_POLL_TEXT = {
	fontWeight: 'bold',
	fontSize: '15px',
	color: COLOR_LIGHTBLACK,
};
/*
const styles = {
	pollContainer: css({
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		width: '100%',
	}),
	pollItem: css({
		height: 32,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		position: 'relative',
	}),
	pollItemNotTop: css({
		marginTop: 4,
	}),
	pollBorder: css({
		width: 7,
		backgroundColor: 'rgba(29, 155, 240, 0.58)',
		borderBottomLeftRadius: 4,
		borderTopLeftRadius: 4,
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		borderRadius: 4,
	}),
	pollTextContainer: css({
		paddingLeft: 12,
		paddingRight: 12,
		width: '80%',
		textAlign: 'left',
	}),
	pollTextAndValue: css({
		fontWeight: '700',
		fontSize: 15,
		color: COLOR_LIGHTBLACK,
		//lineHeight: '20px',
	}),
	pollValueContainer: css({
		paddingLeft: 12,
	}),
};
*/
