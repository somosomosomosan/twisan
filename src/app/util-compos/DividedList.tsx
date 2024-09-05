import { Card, CardBody, Heading, Stack, StackDivider, Text } from '@chakra-ui/react';
import TouchableHighlight from './TouchableHighlight';

type t_listItemProps = {
	title?: string;
	description?: string;
	onClick?: () => any;
};
export default function DividedList(props: { itemProps: t_listItemProps[] }) {
	return (
		<Card>
			<CardBody padding={0}>
				<Stack divider={<StackDivider />} spacing='0'>
					{props.itemProps.map((e, i) => (
						<TouchableHighlight key={i} boxProps={{ padding: 4, onClick: e.onClick }}>
							{e.title && (
								<Heading size='xs' noOfLines={1}>
									{e.title}
								</Heading>
							)}
							{e.description && (
								<Text pt='2' fontSize='sm' noOfLines={1}>
									{e.description}
								</Text>
							)}
						</TouchableHighlight>
					))}
				</Stack>
			</CardBody>
		</Card>
	);
}
