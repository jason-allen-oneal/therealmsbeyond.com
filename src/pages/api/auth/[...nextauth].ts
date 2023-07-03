import NextAuth from "next-auth";

import { nextAuthOptions } from "@/lib/auth";
export const authOptions = nextAuthOptions;
export default NextAuth(nextAuthOptions);
