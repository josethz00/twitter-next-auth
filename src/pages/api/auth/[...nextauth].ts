import NextAuth, { type NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    jwt({ token, user, profile }) {
      const profile_ = profile as { data: { id: string, username: string } };
      if (user && profile) {
        token = {
          ...token,
          id: profile_.data.id,
          username: profile_.data.username,
        };
      }
      return token;
    },
  },
  providers: [
    TwitterProvider({
      clientId: env.TWITTER_ID,
      clientSecret: env.TWITTER_SECRET,
      version: '2.0',
      accessTokenUrl: 'https://api.twitter.com/oauth2/token',
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
