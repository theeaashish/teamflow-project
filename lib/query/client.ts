import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import { serializer } from '../serializer';

/**
 * Creates a TanStack QueryClient preconfigured with the project's key-hashing and (de)hydration behavior.
 *
 * Configured defaults:
 * - Uses the project's serializer to produce a stable string hash for query keys.
 * - Sets query stale time to 60,000 ms to avoid immediate refetch on mount.
 * - Dehydrates queries when the default criteria are met or when a query's state is `pending`; serialized data is returned as `{ json, meta }`.
 * - Rehydrates data by deserializing `{ json, meta }` via the project's serializer.
 *
 * @returns A QueryClient instance configured with the above defaults.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn(queryKey) {
          const [json, meta] = serializer.serialize(queryKey);
          return JSON.stringify({ json, meta });
        },
        staleTime: 60 * 1000, // > 0 to prevent immediate refetching on mount
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        serializeData(data) {
          const [json, meta] = serializer.serialize(data);
          return { json, meta };
        },
      },
      hydrate: {
        deserializeData(data) {
          return serializer.deserialize(data.json, data.meta);
        },
      },
    },
  });
}