import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

export const sendFriendRequestSchema = z.object({
  selfId: z.string().optional(),
  friendId: z.string(),
});

export const friendRequestActionSchema = z.object({
  requestId: z.string(),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>;
export type FriendRequestActionInput = z.infer<typeof friendRequestActionSchema>;
