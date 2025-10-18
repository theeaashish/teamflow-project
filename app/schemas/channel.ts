import z from 'zod';

export function transformChannelName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const channelNameSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Channel name must be at least 2 characters' })
    .max(50, { message: 'Channel name must be less than 50 characters' })
    .transform((name, ctx) => {
      const transform = transformChannelName(name);

      if (transform.length < 2) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Channel name must be at least 2 characters after transforming',
        });

        return z.NEVER;
      }

      return transform;
    }),
});

export type ChannelSchemaNameType = z.infer<typeof channelNameSchema>;
