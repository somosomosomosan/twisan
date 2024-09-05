import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

export function useShowToast() {
	const toast = useToast();
	const onShowToast = useCallback((description: string) => {
		toast({
			//title: 'Account created.',
			description: description,
			status: 'success',
			duration: 1500,
			isClosable: true,
		});
	}, []);
	return { onShowToast };
}
