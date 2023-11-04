import { Select } from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { t_rankingHistory } from '../../utilfuncs/getRankingData';
import { PRIMARY_COLOR } from './consts';

export function RankingHistoriesSelector(props: { rankingHistories: t_rankingHistory[] }) {
	return (
		<Select colorScheme={PRIMARY_COLOR} placeholder='過去の集計結果' onChange={handleChange}>
			{props.rankingHistories.map((e, i) => (
				<option key={e.file_name} value={i === 0 ? '' : e.file_name}>
					{i === 0 ? `${e.file_name} (最新)` : e.file_name}
				</option>
			))}
		</Select>
	);
}
const getUrlWithoutQuery = () => {
	return window.location.href.substring(0, window.location.href.indexOf('?'));
};
const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
	const fileName = event.target.value;
	window.location.href = fileName === '' ? getUrlWithoutQuery() : `?r=${fileName}`;
};
