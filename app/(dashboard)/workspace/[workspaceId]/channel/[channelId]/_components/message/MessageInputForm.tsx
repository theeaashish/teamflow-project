'use client';

import {
  createMessageSchema,
  CreateMessageSchemaType,
} from '@/app/schemas/message';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MessageComposer } from './MessageComposer';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAttachmentUpload } from '@/hooks/use-attachment-upload';
import { Message } from '@/lib/generated/prisma';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs';
import { getAvatar } from '@/lib/get-avatar';

interface MessageInputFormProps {
  channelId: string;
  user: KindeUser<Record<string, unknown>>;
}

type MessagePage = {
  items: Message[];
  nextCursor?: string;
};

type InfiniteMessages = InfiniteData<MessagePage>;

export function MessageInputForm({ channelId, user }: MessageInputFormProps) {
  const queryClient = useQueryClient();
  const [editorKey, setEditorKey] = useState<number>(0);
  const upload = useAttachmentUpload();

  const form = useForm({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      channelId: channelId,
      content: '',
    },
  });

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries({
          queryKey: ['message.list', channelId],
        });
        const previousData = queryClient.getQueryData<InfiniteMessages>([
          'message.list',
          channelId,
        ]);

        const tempId = `optimistic-${crypto.randomUUID()}`;

        const optimisticMessage: Message = {
          id: tempId,
          content: data.content,
          imageUrl: data.imageUrl ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: user.id,
          authorEmail: user.email!,
          authorName: user.given_name ?? 'John Doe',
          authorAvatar: getAvatar(user.picture, user.email!),
          channelId: channelId,
        };

        queryClient.setQueryData<InfiniteMessages>(
          ['message.list', channelId],
          (prev) => {
            if (!prev) {
              return {
                pages: [
                  {
                    items: [optimisticMessage],
                    nextCursor: undefined,
                  },
                ],
                pageParams: [undefined],
              } satisfies InfiniteMessages;
            }

            const firstPage = prev.pages[0] ?? {
              items: [],
              nextCursor: undefined,
            };

            const updatedFirstPage: MessagePage = {
              ...firstPage,
              items: [optimisticMessage, ...firstPage.items],
            };

            return {
              ...prev,
              pages: [updatedFirstPage, ...prev.pages.slice(1)],
            };
          }
        );

        return {
          previousData,
          tempId,
        };
      },
      onSuccess: (data, _variables, context) => {
        queryClient.setQueryData<InfiniteMessages>(
          ['message.list', channelId],
          (prev) => {
            if (!prev) return prev;

            const updatedPages = prev.pages.map((page) => ({
              ...page,
              items: page.items.map((m) =>
                m.id === context.tempId
                  ? {
                      ...data,
                    }
                  : m
              ),
            }));

            return {
              ...prev,
              pages: updatedPages,
            };
          }
        );

        form.reset({ channelId, content: '' });
        upload.clear();
        setEditorKey((prev) => prev + 1);

        return toast.success('Message created successfully');
      },
      onError: (_err, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            ['message.list', channelId],
            context.previousData
          );
        }

        return toast.error('Something went wrong');
      },
    })
  );

  function onSubmit(data: CreateMessageSchemaType) {
    createMessageMutation.mutate({
      ...data,
      imageUrl: upload.stagedUrl ?? undefined,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MessageComposer
                  key={editorKey}
                  onChange={field.onChange}
                  value={field.value}
                  onSubmit={() => onSubmit(form.getValues())}
                  isSubmitting={createMessageMutation.isPending}
                  upload={upload}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
