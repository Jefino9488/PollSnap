import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
                session.user.image = token.picture
            }
            return session
        },
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.sub = user.id
                token.picture = user.image
                await prisma.user.upsert({
                    where: { id: user.id },
                    update: { image: user.image },
                    create: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image
                    }
                })
            }
            return token
        }
    },
    pages: {
        signIn: "/login",
        error: "/"
    },
    debug: true
}
