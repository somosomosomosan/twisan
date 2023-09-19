import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import PageHome from './app/home/page';
import './index.css';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			suspense: true,
			refetchOnWindowFocus: false,
			cacheTime: 1000 * 60 * 10, //キャッシュ破棄時間
			staleTime: 1000 * 60 * 5, //キャッシュ流用時間 5分
		},
	},
});

root.render(
	<React.StrictMode>
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<ChakraProvider theme={theme}>
				<QueryClientProvider client={queryClient}>
					<HelmetProvider>
						<PageHome />
					</HelmetProvider>
				</QueryClientProvider>
			</ChakraProvider>
		</BrowserRouter>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
