import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const AUTH_SECRET = process.env.AUTH_SECRET as string;
export const CORS_ORIGIN = process.env.NEXTAUTH_URL || 'http://localhost:3000';
export const NODE_ENV = process.env.NODE_ENV || 'development';
