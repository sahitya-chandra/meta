import { router } from './trpc';
import { friendsRouter } from './routers/friends';

export const appRouter = router({
  friends: friendsRouter,
});

export type AppRouter = typeof appRouter;