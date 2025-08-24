import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@meta/db';
import { LoginSchema } from '@meta/types';
import { compareSync } from 'bcrypt-ts';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      credentials: {
        email: {
          type: 'email',
          label: 'Email',
          placeholder: 'johndoe@gmail.com',
        },
        password: { type: 'password', label: 'Password', placeholder: '•••••' },
      },
      async authorize(credentials: unknown) {
        const parsed = await LoginSchema.safeParseAsync(credentials);
        if (!parsed.success) throw new Error('Invalid credentials');

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const isValid = compareSync(password, user.password);
        if (!isValid) throw new Error('Invalid credentials');

        return { id: user.id, email: user.email, name: user.name };
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: 'jwt' },
  pages: { signIn: '/signin' },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
