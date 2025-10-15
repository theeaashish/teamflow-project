import { createQueryClient } from './client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { cache } from 'react';

export const getQueryClient = cache(createQueryClient);

/**
 * Hydrates a TanStack QueryClient state into a React Query HydrationBoundary for the given child subtree.
 *
 * @param children - React nodes to render inside the hydration boundary
 * @param client - QueryClient whose dehydrated state will be provided to the HydrationBoundary
 * @returns A HydrationBoundary component that wraps `children` with the dehydrated state of `client`
 */
export function HydrateClient(props: {
  children: React.ReactNode;
  client: QueryClient;
}) {
  return (
    <HydrationBoundary state={dehydrate(props.client)}>
      {props.children}
    </HydrationBoundary>
  );
}