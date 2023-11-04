import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { COLOR_LIGHTBLACK, COLOR_SUBTEXT, COLOR_SUBTEXT_IN_DARKMODE } from './components/tweetComponents/consts';
const theme = {
	config: {
		initialColorMode: 'light',
		useSystemColorMode: true,
	},
	styles: {
		global: (props: any) => ({
			// classで切り替えられるようにする
			'.mainText': {
				color: mode(COLOR_LIGHTBLACK, '#fff')(props),
			},
			'.subText': {
				color: mode(COLOR_SUBTEXT, COLOR_SUBTEXT_IN_DARKMODE)(props),
			},
			'.tHeader': {
				bg: mode('brand.ml', 'brand.md')(props), // colorsで設定した色が利用可能
			},
			'.tBGSub': {
				bg: mode('gray.100', 'gray.700')(props), // chakra-uiが提供するセットも使える
			},
			'.tBGFooter': {
				bg: mode('gray.200', 'gray.600')(props),
			},
		}),
	},
};

export default extendTheme(theme);
