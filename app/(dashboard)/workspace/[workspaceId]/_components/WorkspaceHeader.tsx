'use client';

import { orpc } from '@/lib/orpc';
import { useSuspenseQuery } from '@tanstack/react-query';

export function WorkspaceHeader() {
  const {
    data: { currentWorkspace },
  } = useSuspenseQuery(orpc.channel.list.queryOptions());

  return (
    <h1 className="text-lg font-semibold"> {currentWorkspace.orgName} </h1>
  );
}
