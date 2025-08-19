import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export interface MessagePayload {
  toUserId: string;
  content: string;
}