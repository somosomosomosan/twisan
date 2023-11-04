import { IconButton, Tooltip, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

export function ColorSwitchButton() {
	const { colorMode, toggleColorMode } = useColorMode();
	const tooltipLabel = colorMode === 'light' ? 'ダークモードへ切り替えます' : 'ライトモードへ切り替えます';
	return (
		<Tooltip label={tooltipLabel}>
			<IconButton
				aria-label='change theme'
				icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
				onClick={toggleColorMode}
			/>
		</Tooltip>
	);
}
