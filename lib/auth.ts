import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import prisma from './prisma';

export const config = {
  providers: [Google],
  pages: {
    signIn: '/login'
  }
};
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...config,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  jwt: { maxAge: 60 * 60 * 48 },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async signIn({ profile }) {
      console.log('this is profile', profile);
      if (!profile || !profile.email || !profile.name) {
        console.error('Profile is missing required fields');
        return false;
      }
      await prisma.admin.upsert({
        create: {
          email: profile.email as string,
          name: profile.name as string,
          image: profile.picture || '',
          role: 'manager' // Assign a default role
        },
        update: {
          email: profile.email as string,
          name: profile.name as string,
          image: profile.picture || '',
          role: 'manager' // Ensure the role is updated if necessary
        },
        where: {
          email: profile.email as string
        }
      });
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.account = account;
        token.id = account.id;
      }
      return token;
    },
    async session(params) {
      console.log('this is token', params.token);
      console.log('this is session', params.session);
      return params.session;
    }
  }
});
