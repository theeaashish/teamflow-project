'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { orpc } from '@/lib/orpc';
import { cn } from '@/lib/utils';
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useSuspenseQuery } from '@tanstack/react-query';

// const Workspaces = [
//   {
//     id: "1",
//     name: "Teamflow 1",
//     avatar: "TF",
//   },
//   {
//     id: "2",
//     name: "Teamflow 2",
//     avatar: "TF 2",
//   },
//   {
//     id: "3",
//     name: "Teamflow 3",
//     avatar: "TF 3",
//   },
// ] as const;

const colorCombinations = [
  'bg-blue-500 hover:bg-blue-600 text-white',
  'bg-emerald-500 hover:bg-emerald-600 text-white',
  'bg-purple-500 hover:bg-purple-600 text-white',
  'bg-amber-500 hover:bg-amber-600 text-white',
  'bg-rose-500 hover:bg-rose-600 text-white',
  'bg-indigo-500 hover:bg-indigo-600 text-white',
  'bg-cyan-500 hover:bg-cyan-600 text-white',
  'bg-pink-500 hover:bg-pink-600 text-white',
] as const;

const getWorkspaceColor = (id: string) => {
  const charSum = id
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorIndex = charSum % colorCombinations.length;
  return colorCombinations[colorIndex];
};

/**
 * Renders a vertical list of workspace icons with per-workspace login links and tooltips.
 *
 * Each workspace displays a colored icon (color derived from its id), opens a LoginLink scoped to that workspace,
 * and shows the workspace name in a tooltip. The currently active workspace is visually highlighted and marked with "(Current)" in the tooltip.
 *
 * @returns The JSX element that renders the workspace list.
 */
export function WorkspaceList() {
  const {
    data: { workspaces, currentWorkspace },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        {workspaces.map((workspace) => {
          const isActive = currentWorkspace.orgCode === workspace.id;

          return (
            <Tooltip key={workspace.id}>
              <TooltipTrigger asChild>
                <LoginLink orgCode={workspace.id}>
                  <Button
                    size="icon"
                    // className="size-12 transition-all duration-200"
                    className={cn(
                      'size-12 transition-all duration-200',
                      getWorkspaceColor(workspace.id),
                      isActive ? 'rounded-lg' : 'rounded-xl hover:rounded-lg'
                    )}
                  >
                    <span className="text-sm font-semibold">
                      {workspace.avatar}
                    </span>
                  </Button>
                </LoginLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>
                  {workspace.name} {isActive && '(Current)'}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}