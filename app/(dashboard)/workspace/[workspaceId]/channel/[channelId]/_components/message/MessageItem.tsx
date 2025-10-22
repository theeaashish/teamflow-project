import { SafeContent } from '@/components/rich-text-editior/SafeContent';
import { Message } from '@/lib/generated/prisma';
import { getAvatar } from '@/lib/get-avatar';
import Image from 'next/image';

interface iAppProps {
  message: Message;
}

export function MessageItem({ message }: iAppProps) {
  return (
    <div className="flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50">
      <Image
        src={getAvatar(message.authorAvatar, message.authorEmail)}
        alt="User Avatar"
        width={32}
        height={32}
        className="size-10 rounded-lg"
      />

      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-x-2">
          <p className="font-medium text-sm leading-none">
            {message.authorName}
          </p>
          <p className="text-xs text-muted-foreground leading-none">
            {/* date */}
            {new Intl.DateTimeFormat('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }).format(message.createdAt)}{' '}
            {/* time */}
            {new Intl.DateTimeFormat('en-IN', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            }).format(message.createdAt)}
          </p>
        </div>

        <SafeContent
          className="text-sm break-words prose dark:prose-invert max-w-none marker:text-primary"
          content={JSON.parse(message.content)}
        />

        {message.imageUrl && (
          <div className="mt-3">
            <Image
              src={message.imageUrl}
              alt="Message attachment"
              width={512}
              height={512}
              className="rounded-md max-h-[320px] w-auto object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
