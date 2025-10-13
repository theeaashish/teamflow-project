import { CreateWorkspace } from "./_components/CreateWorkspace";
import { UserNav } from "./_components/UserNav";
import { WorkspaceList } from "./_components/WorkspaceList";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen flex">
      <div className="flex flex-col items-center h-full w-16 bg-secondary px-2 py-3 border-r border-border">
        <WorkspaceList />

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
