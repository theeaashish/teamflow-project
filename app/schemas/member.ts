import { z } from 'zod';

export const inviteMemberSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(80, { message: 'Name must be less than 80 characters' }),
  email: z.email(),
});

export type InviteMemberSchemaType = z.infer<typeof inviteMemberSchema>;
