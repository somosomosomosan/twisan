import { ListItem, UnorderedList } from '@chakra-ui/react';

/*
function RankingHistoriesModal() {
				 const { isOpen, onOpen, onClose } = useDisclosure();
				return (
								<>
										  
												<Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
																<ModalOverlay />
																<ModalContent>
																				<ModalBody padding={0}>
																								<DividedList itemProps={generateListItemsData({ ...props, onShowToast })} />
																				</ModalBody>
																</ModalContent>
												</Modal>
								</>
				);
}*/
export function Tips(props: { isPc: boolean }) {
	return (
		<UnorderedList spacing={3}>
			{TIPS_TEXT.map((e, i) => (
				<ListItem key={i}>{props.isPc ? e.pc : e.mobile}</ListItem>
			))}
		</UnorderedList>
	);
}

const TIPS_TEXT_CLICK_POST_PC = '投稿をクリックするといろいろできます。';
const TIPS_TEXT_CLICK_POST_MOBILE = '投稿をタップするといろいろできます。';
const TIP_TEXT_ABOUT_READS_COLLAPSE =
	'「既読を非表示」にすると、最近表示したことのある投稿が非表示になります。※作動しない場合は一旦リロードしてみてください。';
const TIP_TEXT_ABOUT_READS_CHECKMARK = '最近表示したことのあるツイートには右上にチェックマークが表示されます';
const TIPS_TEXT_NOIMAGE = '通信量が気になる方は、「投稿表示設定」→「画像無し」をどうぞ。';
const TIPS_TEXT_MOTIVATION = 'データ収集精度はこれから徐々に良くなっていきます。';

export const TIPS_TEXT = [
	{ pc: TIPS_TEXT_CLICK_POST_PC, mobile: TIPS_TEXT_CLICK_POST_MOBILE },
	{
		pc: TIP_TEXT_ABOUT_READS_CHECKMARK,
		mobile: TIP_TEXT_ABOUT_READS_CHECKMARK,
	},
	{
		pc: TIP_TEXT_ABOUT_READS_COLLAPSE,
		mobile: TIP_TEXT_ABOUT_READS_COLLAPSE,
	},
	{
		pc: TIPS_TEXT_NOIMAGE,
		mobile: TIPS_TEXT_NOIMAGE,
	},
	{
		pc: TIPS_TEXT_MOTIVATION,
		mobile: TIPS_TEXT_MOTIVATION,
	},
];
