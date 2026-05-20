import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import type { PropsWithChildren, ReactElement } from 'react';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from '../contexts/ThemeProvider';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function AppProviders({
  children,
}: PropsWithChildren<{}>): ReactElement {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="bottom-center" />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
