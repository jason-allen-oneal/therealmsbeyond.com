import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

import { verify } from "argon2";

import { prisma } from "./prisma";
import { loginSchema } from "./validation/auth";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<any> => {
        try {
          const { email, password } = await loginSchema.validate(credentials);

          const result = await prisma.user.findFirst({
            where: { email },
          });

          if (!result) return null;

          const isValidPassword = await verify(
            result.password,
            password as string
          );

          if (!isValidPassword) return null;

          return result;
        } catch (e) {
          console.log("error", e);
          return null;
        }
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT as string,
      clientSecret: process.env.TWITTER_SECRET as string,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id as number;
        token.email = user.email as string;
        token.name = user.name;
        token.avatar = user.avatar;
        token.joined = user.joined;
        token.verified = user.verified;
        token.admin = user.admin;
        token.slug = user.slug;
        token.bio = user.bio;
        token.chat = user.chat;
        token.socket = user.socket;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token;
      }

      return session;
    },
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  pages: {
    signIn: "/user/login",
    newUser: "/user/register",
  },
  secret: "$0|/|37]-[!||9//!c|<3d",
};
