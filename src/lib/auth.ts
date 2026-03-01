import { NextAuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"]
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id
            }
            return session
        },
    },
    debug: true,
    // pages: {
    //     signIn: "/", // We will put sign-in on the landing page
    // },
}
