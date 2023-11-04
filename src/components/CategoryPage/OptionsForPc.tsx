import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Stack } from '@chakra-ui/react';
import { FaCheck } from 'react-icons/fa';
import { t_tweetViewStyleMode } from '../tweetListComponents/TweetListItem';
import { PRIMARY_COLOR, SPACE_V_STACK } from './consts';

export function OptionsForPc(props: {
	isCollapseRead: boolean;
	onChangeCollapseReadsMode: () => any;
	tweetViewStyleMode: t_tweetViewStyleMode;
	onChangeTweetViewStyleMode: (e: t_tweetViewStyleMode) => any;
}) {
	return (
		<Flex flexDirection={'column'}>
			<Stack spacing={SPACE_V_STACK} direction='row' justifyContent='center' marginBottom={4}>
				<Menu>
					<MenuButton as={Button} colorScheme={PRIMARY_COLOR} size={'lg'} variant='outline'>
						投稿表示設定
					</MenuButton>
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
					</MenuList>
				</Menu>
				<Button
					variant={props.isCollapseRead ? undefined : 'outline'}
					colorScheme={PRIMARY_COLOR}
					size='lg'
					onClick={props.onChangeCollapseReadsMode}
				>
					既読を非表示
				</Button>
				{/*
            <Button variant='outline' colorScheme={PRIMARY_COLOR} size='lg'>
                非表示アカウント設定
            </Button>
            */}
			</Stack>
			<Stack spacing={SPACE_V_STACK} direction='row' justifyContent='center'></Stack>
		</Flex>
	);
}
