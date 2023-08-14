import { Text } from '@chakra-ui/react';

export default function NoEscapeChakraText(props: { chakraProps: React.ComponentProps<typeof Text>; text: string }) {
	return <Text {...props.chakraProps} dangerouslySetInnerHTML={{ __html: props.text }}></Text>;
}
