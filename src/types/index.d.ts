export {};

import {
  type Article,
  type BlogCategory,
  type BlogComment,
  type ChatMessages,
  type ChatRooms,
  type GalleryCategory,
  type GalleryComment,
  type Gallery,
  type Entry,
  type Sessions,
  type User,
  type Tags,
} from "@prisma/client";

declare global {
  export type APIResponse = {
    status: number;
    message: string;
    result: any | any[];
  };

  export type {
    Article,
    BlogCategory,
    BlogComment,
    ChatMessages,
    ChatRooms,
    GalleryComment,
    GalleryCategory,
    Gallery,
    Entry,
    Sessions,
    User,
    Tags,
  };

  export type Comment = BlogComment | GalleryComment;
  export type Category = BlogCategory | GalleryCategory;

  export type SessionUser = {
    id: number;
    name: string;
    joined: number;
    verified: number;
    subtype: number;
    admin: number;
    avatar: string;
    slug: string;
    email: string;
    bio: string;
    socket: string;
    chat: number;
    perPage: number;
    sort: string;
  };

  export type Room = {
    id: number;
    name: string;
    creator: number;
    date: Date;
  };

  export type Channel = {
    id: number;
    name: string;
    count: number;
    members: ChatUser[];
  };

  export type ChatMessage = {
    time: string;
    text: string;
    user: {
      id: number;
      name: string;
      avatar: string;
      socket: string;
    };
    channel: {
      id: number;
      name: string;
    };
    type: string;
  };

  export interface ChatUser {
    [key: string]: number | string | Room | null;
    id: number;
    name: string;
    avatar: string;
    socket: string;
    channel: number;
  }
}
