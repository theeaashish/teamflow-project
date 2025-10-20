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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';
import { toast } from 'sonner';

interface MessageInputFormProps {
  channelId: string;
}

export function MessageInputForm({ channelId }: MessageInputFormProps) {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      channelId: channelId,
      content: '',
    },
  });

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onSuccess: () => {
        form.reset(); // reset after successful msg creation
        queryClient.invalidateQueries({
          queryKey: orpc.message.list.key(),
        });
        return toast.success('Message created successfully');
      },
      onError: () => {
        return toast.error('Failed to create message');
      },
    })
  );

  function onSubmit(data: CreateMessageSchemaType) {
    createMessageMutation.mutate(data);
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
                  onChange={field.onChange}
                  value={field.value}
                  onSubmit={() => onSubmit(form.getValues())}
                  isSubmitting={createMessageMutation.isPending}
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
