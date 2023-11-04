import { Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { SIZE_TEXT_S } from './consts';
type P = {
	createdAt: string;
	includeTime: boolean;
};
/**
 * 投稿時間。
 * 名前の横かツイート下部のどちらかに設置することになる。
 * 名前の横の場合はincluedTime=false
 */
export default function CreatedAt(props: P) {
	return (
		<Text className={'subText'} size={`${SIZE_TEXT_S}px`}>
			{props.includeTime
				? format(new Date(props.createdAt), 'HH:mm · yyyy/MM/dd')
				: format(new Date(props.createdAt), 'yyyy/MM/dd')}
		</Text>
	);
}
