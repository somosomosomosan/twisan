import { Button, Menu, MenuButton, MenuItem, MenuList, VStack } from '@chakra-ui/react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { t_tweetViewStyleMode } from '../tweetListComponents/TweetListItem';
import { PRIMARY_COLOR, SPACE_V_STACK } from './consts';

export function OptionsForMobile(props: {
	isCollapseRead: boolean;
	onChangeCollapseReadsMode: () => any;
	tweetViewStyleMode: t_tweetViewStyleMode;
	onChangeTweetViewStyleMode: (e: t_tweetViewStyleMode) => any;
}) {
	return (
		<Menu>
			<VStack spacing={SPACE_V_STACK}>
				<MenuButton as={Button} colorScheme={PRIMARY_COLOR} size={'lg'} variant='outline' rightIcon={<FaChevronDown />}>
					投稿表示設定
				</MenuButton>
				<Button
					variant={props.isCollapseRead ? undefined : 'outline'}
					colorScheme={PRIMARY_COLOR}
					size='md'
					onClick={props.onChangeCollapseReadsMode}
				>
					既読を非表示
				</Button>
			</VStack>

			<MenuList>
				<MenuItem
					onClick={() => props.onChangeTweetViewStyleMode('CUSTOM')}
					icon={props.tweetViewStyleMode === 'CUSTOM' ? <FaCheck /> : undefined}
				>
					普通
				</MenuItem>
				<MenuItem
					onClick={() => props.onChangeTweetViewStyleMode('NO_MEDIAS')}
					icon={props.tweetViewStyleMode === 'NO_MEDIAS' ? <FaCheck /> : undefined}
				>
					画像無し
				</MenuItem>
				<MenuItem
					onClick={() => props.onChangeTweetViewStyleMode('EMBED')}
					icon={props.tweetViewStyleMode === 'EMBED' ? <FaCheck /> : undefined}
				>
					埋め込み
				</MenuItem>
				{/*
            <MenuItem as='a' href='#'>
                非表示アカウント設定
            </MenuItem>
            */}
			</MenuList>
		</Menu>
	);
}
