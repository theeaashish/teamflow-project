'use client';

import { useState } from 'react';
import { createQueryClient } from './client';
import { QueryClientProvider } from '@tanstack/react-query';

/**
 * Provides a TanStack Query client to descendant components.
 *
 * Creates a QueryClient instance once and supplies it via a QueryClientProvider
 * that wraps the given children.
 *
 * @param props.children - React nodes to render inside the QueryClientProvider
 * @returns A JSX element that supplies a QueryClient to its descendants
 */
export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}