import { auth } from '@repo/auth';
import { initTRPC, TRPCError } from '@trpc/server';

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  return next({ ctx: { ...ctx, userId: session.user.id } });
});

export type Context = {
  userId?: string;
};