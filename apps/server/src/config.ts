export const PORT = process.env.PORT || 4000;
export const AUTH_SECRET =
  (process.env.AUTH_SECRET as string) ||
  'nPvyvx3ZQJbtGboZJBSIODKumLOWGBRgz5MkXf/VmoU=';
export const CORS_ORIGIN = process.env.NEXT_ORIGIN || 'http://localhost:3000';
