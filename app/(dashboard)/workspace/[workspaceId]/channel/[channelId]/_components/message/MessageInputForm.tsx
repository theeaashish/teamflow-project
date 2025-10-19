'use client';

import { createMessageSchema } from '@/app/schemas/message';
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

interface MessageInputFormProps {
  channelId: string;
}

export function MessageInputForm({ channelId }: MessageInputFormProps) {
  const form = useForm({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      channelId: channelId,
      content: '',
    },
  });
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MessageComposer
                  onChange={field.onChange}
                  value={field.value}
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
