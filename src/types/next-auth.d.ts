import NextAuth, { DefaultSession, JWT, DefaultUser, User } from "next-auth";

declare module "simplelightbox";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      joined: number;
      verified: number;
      admin: number;
      avatar: string;
      slug: string;
      email: string;
      bio: string;
      chat: number;
      socket: string;
    };
  }

  interface User extends Omit<DefaultUser, "id"> {
    id: number;
    name: string;
    joined: number;
    verified: number;
    admin: number;
    avatar: string;
    slug: string;
    email: string;
    bio: string;
    chat: number;
    socket: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    name: string;
    joined: number;
    verified: number;
    admin: number;
    avatar: string;
    slug: string;
    email: string;
    bio: string;
    chat: number;
    socket: string;
  }
}
