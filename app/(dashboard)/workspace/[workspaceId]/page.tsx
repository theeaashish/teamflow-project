import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { client } from '@/lib/orpc';
import { AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { CreateNewChannel } from './_components/CreateNewChannel';

interface WorkspaceIdPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceIdPage({
  params,
}: WorkspaceIdPageProps) {
  const { workspaceId } = await params;
  // const { channels } = await client.channel.list();
  let channels;

  try {
    const result = await client.channel.list();
    channels = result.channels;
  } catch (error) {
    console.error('Failed to fetch channels:', error);
    return (
      <div>
        <h1>Error loading channels</h1>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (channels.length > 0) {
    return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`);
  }

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle />
        </EmptyMedia>
        <EmptyTitle>No channels yet!</EmptyTitle>
        <EmptyDescription>
          Create your first channel to get started!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='mx-w-xs mx-auto'>
        <CreateNewChannel />
      </EmptyContent>
    </Empty>
  );
}
