import { NextUIProvider, Spinner } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { withErrorBoundary } from 'react-error-boundary';
import { QueryClientProvider } from '@app/providers/with-query-client';
import { BrowserRouter } from '@app/providers/with-router';
import { withSuspense } from '@app/providers/with-suspense';
import { ToastifyContainerProvider } from '@app/providers/with-toastify';
import { FullPageError } from '@pages/error';
import '../styles/index.css';

function Providers() {
  // TODO: удалить некст темы

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <QueryClientProvider>
          <BrowserRouter />
          <ToastifyContainerProvider />
        </QueryClientProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

const SuspenseProvider = withSuspense(Providers, {
  fallback: <Spinner size="lg" />,
});
export const Provider = withErrorBoundary(SuspenseProvider, {
  // <FullPageError error={error} />
  fallbackRender: ({ error }) => <FullPageError error={error} />,
});
