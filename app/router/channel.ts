import { z } from 'zod';
import { heavyWriteSecurityMiddleware } from '../middlewares/arcjet/heavy-write';
import { standardSecurityMiddleware } from '../middlewares/arcjet/standard';
import { requiredAuthMiddleware } from '../middlewares/auth';
import { base } from '../middlewares/base';
import { requiredWorkspaceMiddleware } from '../middlewares/workspace';
import { channelNameSchema } from '../schemas/channel';
import prisma from '@/lib/prisma';
import { Channel } from '@/lib/generated/prisma';

export const createChannel = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: 'POST',
    path: '/channels',
    summary: 'Create a new Channel',
    tags: ['channels'],
  })
  .input(channelNameSchema)
  .output(z.custom<Channel>())
  .handler(async ({ input, context }) => {
    const channel = await prisma.channel.create({
      data: {
        name: input.name,
        workspaceId: context.workspace.orgCode,
        createdById: context.user.id,
      },
    });

    return channel;
  });
