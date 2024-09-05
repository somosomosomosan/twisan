import { Image } from '@chakra-ui/react';

export default function Avatar(props: { url: string; size: 'M' | 'S'; fallbackPicUrl: string }) {
	return (
		<Image
			borderRadius='full'
			boxSize={props.size === 'S' ? '20px' : '40px'}
			src={props.url}
			fallbackSrc={props.fallbackPicUrl}
		/>
	);
}
