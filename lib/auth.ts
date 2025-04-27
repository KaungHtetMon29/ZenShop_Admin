import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import prisma from './prisma';
import jwt from 'jsonwebtoken';

// JWT Secret key - make sure it's set in your .env file as JWT_SECRET="KHM28"
const JWT_SECRET = process.env.JWT_SECRET;

export const config = {
  providers: [Google],
  pages: {
    signIn: '/login'
  }
};

// Extend the built-in types to include our custom properties
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
    };
    accessToken?: string;
  }
}

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

      // Upsert the user and get the result which contains the MongoDB _id
      const user = await prisma.user.upsert({
        create: {
          email: profile.email as string,
          name: profile.name as string,
          image: profile.picture || ''
        },
        update: {
          email: profile.email as string,
          name: profile.name as string,
          image: profile.picture || ''
        },
        where: {
          email: profile.email as string
        }
      });

      // Add the MongoDB _id to the profile
      profile._id = user.id;

      return true;
    },
    async jwt({ token, account, profile }) {
      // Store OAuth account info in the token when signing in
      if (account) {
        console.log('Account info detected in token flow');
        token.account = account;

        // Always generate a token when we have account information (new sign-in)
        if (account.access_token) {
          token.accessToken = account.access_token;
        }
      }

      // If we have a profile with _id, use it
      if (profile && profile._id) {
        token._id = profile._id;

        // Always create a custom token when we have profile info
        // This ensures we have a token even on first login
        const customToken = jwt.sign(
          {
            id: profile._id,
            name: profile.name,
            email: profile.email
          },
          JWT_SECRET!,
          { expiresIn: '48h' }
        );

        token.accessToken = customToken;
        console.log(
          'JWT Token generated from profile:',
          token.accessToken ? 'Available' : 'Missing'
        );
      }
      // If no _id in token, try to get user from database
      else if (!token._id && token.email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, name: true }
          });

          if (user) {
            token._id = user.id;
            token.name = user.name;

            // Create a custom JWT token with the JWT_SECRET
            const customToken = jwt.sign(
              {
                id: user.id,
                name: user.name,
                email: token.email
              },
              JWT_SECRET!,
              { expiresIn: '48h' }
            );

            // Add the custom token to the NextAuth token
            token.accessToken = customToken;
            console.log(
              'JWT Token generated from database lookup:',
              token.accessToken ? 'Available' : 'Missing'
            );
          } else {
            console.warn(
              `User not found in database for email: ${token.email}`
            );
          }
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      }

      // Ensure token always has accessToken
      if (!token.accessToken && token._id) {
        // Fallback: create a token if we have user ID but no token
        token.accessToken = jwt.sign(
          {
            id: token._id,
            name: token.name || 'User',
            email: token.email || 'unknown'
          },
          JWT_SECRET!,
          { expiresIn: '48h' }
        );
        console.log('Created fallback access token');
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Always ensure user object exists
      if (!session.user) {
        session.user = {};
      }

      // Pass the MongoDB _id to the session's user object if available
      if (token._id) {
        session.user.id = token._id as string;
      }

      // IMPORTANT: Always add the accessToken to the session regardless of user ID
      // This ensures the token is available for API calls
      session.accessToken = token.accessToken;

      // Log complete session structure for debugging
      console.log(
        'Session structure:',
        JSON.stringify(
          {
            user: session.user,
            expires: session.expires,
            hasAccessToken: !!session.accessToken,
            tokenLength: session.accessToken ? session.accessToken.length : 0
          },
          null,
          2
        )
      );

      return session;
    }
  }
});

// Export a function to get the JWT token from the session
export const getAuthToken = async () => {
  const session = await auth();
  return session?.accessToken || null;
};
