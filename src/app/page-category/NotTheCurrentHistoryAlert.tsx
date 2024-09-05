import { Alert, AlertIcon, Link, Text } from '@chakra-ui/react';
import { COLOR_LINK } from '../tweet-components/inners/consts';

export function NotTheCurrentHistoryAlert(props: { categoryUrl: string }) {
	return (
		<Alert status='warning'>
			<AlertIcon />
			<Text>
				最新の集計結果があります。
				<Link color={COLOR_LINK} href={`./${props.categoryUrl}`}>
					表示する
				</Link>
			</Text>
		</Alert>
	);
}
