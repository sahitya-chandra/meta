import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const AUTH_SECRET =
  (process.env.AUTH_SECRET as string);
  console.log('AUTH_SECRET:', AUTH_SECRET);
export const CORS_ORIGIN = process.env.NEXT_ORIGIN || 'http://localhost:3000';
