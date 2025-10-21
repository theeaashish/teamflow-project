import { z } from 'zod';

export const createMessageSchema = z.object({
  channelId: z.string(),
  content: z
    .string()
    .min(2, { message: 'Message must be at least 2 characters' }),
  imageUrl: z.url().optional(),
});

export type CreateMessageSchemaType = z.infer<typeof createMessageSchema>;
