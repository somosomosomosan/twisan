/** @jsxImportSource @emotion/react */
import { Button } from '@chakra-ui/react';

export default function ToTweetButton(props: { url: string }) {
	return (
		/* @ts-ignore */
		<Button
			colorScheme={'twitter'}
			variant={'outline'}
			width={'100%'}
			marginBottom={'12px'}
			zIndex={99}
			borderRadius='9999px'
			transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
			_hover={{ backgroundColor: 'rgba(222,235,246,1)', cursor: 'pointer', zIndex: 99 }}
			_active={{
				backgroundColor: 'rgba(213,228,241,1)',
			}}
			onClick={(event: any) => {
				//オプションが開くのを防ぐ
				event.stopPropagation();
				window.open(props.url);
			}}
		>
			元の投稿へ
		</Button>
	);
}
