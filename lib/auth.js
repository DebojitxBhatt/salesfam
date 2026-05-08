import bcrypt from "bcryptjs"
import CredentialsProviderModule from "next-auth/providers/credentials"

import { connectMongoDB } from "@/lib/mongodb"
import User from "@/models/user"

const CredentialsProvider =
  CredentialsProviderModule.default ?? CredentialsProviderModule

/** @type {import("next-auth").AuthOptions} */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase()
        const password = credentials?.password

        try {
          if (!email || !password) {
            return null
          }

          await connectMongoDB()
          const user = await User.findOne({ email })

          if (!user || !user.password) {
            return null
          }

          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (!passwordsMatch) {
            return null
          }

          return {
            email: user.email,
            name: user.name,
            role: user.role,
            commission_rate: user.commission_rate,
            avatar: user.avatar,
            id: user._id.toString(),
          }
        } catch (error) {
          console.log("Error: ", error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === "update" && session) {
        return {
          ...token,
          name: session?.user.name,
        }
      }
      if (user) {
        return {
          ...token,
          role: user.role,
          id: user.id,
          commission_rate: user.commission_rate,
          avatar: user.avatar,
        }
      }
      return token
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          id: token.id,
          commission_rate: token.commission_rate,
          avatar: token.avatar,
        },
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
}
