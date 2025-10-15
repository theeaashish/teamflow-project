import { CreateWorkspace } from "./_components/CreateWorkspace";
import { UserNav } from "./_components/UserNav";
import { WorkspaceList } from "./_components/WorkspaceList";
import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

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
          <UserNav />
        </div>
      </div>
      {children}
    </div>
  );
}
