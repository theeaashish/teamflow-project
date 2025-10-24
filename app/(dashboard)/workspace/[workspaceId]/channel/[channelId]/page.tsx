'use client';

import { useParams } from 'next/navigation';
import { ChannelHeader } from './_components/channelHeader';
import { MessageInputForm } from './_components/message/MessageInputForm';
import { MessageList } from './_components/MessageList';
import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs';

export default function ChannelPageMain() {
  const { channelId } = useParams<{ channelId: string }>();
  const { data, error, isLoading } = useQuery(
    orpc.channel.get.queryOptions({
      input: {
        channelId: channelId,
      },
    })
  );

  if (error) {
    return <p>error</p>;
  }

  return (
    <div className="flex h-screen w-full">
      {/* main channel are*/}
      <div className="flex flex-col flex-1 min-w-0">
        <ChannelHeader />

        {/* scrollable messages area */}
        <div className="flex-1 overflow-hidden mb-4">
          <MessageList />
        </div>

        {/* fixed input */}
        <div className="border-t bg-background p-4">
          <MessageInputForm
            user={data?.currentUser as KindeUser<Record<string, unknown>>}
            channelId={channelId}
          />
        </div>
      </div>
    </div>
  );
}
