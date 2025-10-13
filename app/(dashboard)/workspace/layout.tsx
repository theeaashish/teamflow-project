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
      </div>
    </div>
  );
}
