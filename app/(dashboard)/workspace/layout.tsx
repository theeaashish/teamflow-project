import { CreateWorkspace } from './_components/CreateWorkspace';
import { UserNav } from './_components/UserNav';
import { WorkspaceList } from './_components/WorkspaceList';
import { orpc } from '@/lib/orpc';
import { getQueryClient, HydrateClient } from '@/lib/query/hydration';

/**
 * Workspace dashboard layout that preloads the workspace list and renders a fixed sidebar alongside the main content.
 *
 * Prefetches workspace list data into a QueryClient used to hydrate WorkspaceList and UserNav, then renders a left sidebar
 * containing workspace navigation and controls and the provided `children` as the right-side content area.
 *
 * @param children - Content to render in the layout's main (right-side) area
 * @returns A React element containing the workspace sidebar and the provided `children` as the main content
 */
export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.workspace.list.queryOptions());

  return (
    <div className="w-full h-screen flex">
      <div className="flex flex-col items-center h-full w-16 bg-secondary px-2 py-3 border-r border-border">
        <HydrateClient client={queryClient}>
          <WorkspaceList />
        </HydrateClient>

        <div className="mt-4">
          <CreateWorkspace />
        </div>

        <div className="mt-auto">
          <HydrateClient client={queryClient}>
            <UserNav />
          </HydrateClient>
        </div>
      </div>
      {children}
    </div>
  );
}