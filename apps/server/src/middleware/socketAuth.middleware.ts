import { Socket } from 'socket.io';
import { AuthenticatedSocket } from '../types';
import { decryptToken } from '../utils/authhelper';

export const wsAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.query.token as string | undefined;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const payload = await decryptToken(token, true);

    if (!payload?.sub) {
      return next(new Error('Authentication error: Invalid token payload'));
    }

    (socket as AuthenticatedSocket).userId = payload.sub;
    next();
  } catch (err) {
    console.error('WS auth error:', err);
    next(new Error('Authentication error: Token validation failed'));
  }
};
