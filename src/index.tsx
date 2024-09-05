import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import RouterRoute from './app/routers/RouterRoute';
import './index.css';
import theme from './theme';

const root = createRoot(document.getElementById('root') as HTMLElement);
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			suspense: true,
			refetchOnWindowFocus: false,
			cacheTime: Infinity, //キャッシュ破棄時間
			staleTime: Infinity, //キャッシュ流用時間
		},
	},
});

root.render(
	<React.StrictMode>
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<ChakraProvider theme={theme}>
				<QueryClientProvider client={queryClient}>
					<HelmetProvider>
						<RouterRoute />
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
