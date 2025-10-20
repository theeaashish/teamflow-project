import { z } from 'zod';
import { standardSecurityMiddleware } from '../middlewares/arcjet/standard';
import { writeSecurityMiddleware } from '../middlewares/arcjet/write';
import { requiredAuthMiddleware } from '../middlewares/auth';
import { base } from '../middlewares/base';
import { requiredWorkspaceMiddleware } from '../middlewares/workspace';
import prisma from '@/lib/prisma';
import { createMessageSchema } from '../schemas/message';
import { getAvatar } from '@/lib/get-avatar';
import { Message } from '@/lib/generated/prisma';
import { readSecurityMiddleware } from '../middlewares/arcjet/read';

export const createMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: 'POST',
    path: '/message',
    summary: 'Create a new message',
    tags: ['Messages'],
  })
  .input(createMessageSchema)
  .output(z.custom<Message>())
  .handler(async ({ input, context, errors }) => {
    // verify channel belongs to the users organization
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    });

    if (!channel) {
      throw errors.FORBIDDEN();
    }

    const created = await prisma.message.create({
      data: {
        content: input.content,
        imageUrl: input.imageUrl,
        channelId: input.channelId,
        authorId: context.user.id,
        authorEmail: context.user.email!,
        authorName: context.user.given_name ?? 'John Doe',
        authorAvatar: getAvatar(context.user.picture, context.user.email!),
      },
    });

    return {
      ...created,
    };
  });

export const listMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(readSecurityMiddleware)
  .route({
    method: 'GET',
    path: '/messages',
    summary: 'List all messages',
    tags: ['Messages'],
  })
  .input(z.object({
    channelId: z.string(),
  }))
  .output(z.array(z.custom<Message>()))
  .handler(async ({ input, context, errors }) => {
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    });

    if (!channel) {
      throw errors.FORBIDDEN();
    }

    const data = await prisma.message.findMany({
      where: {
        channelId: input.channelId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return data;
  });
