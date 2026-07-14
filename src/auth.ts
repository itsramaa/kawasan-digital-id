import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Discord from 'next-auth/providers/discord'
import { prisma } from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  // ponytail: PrismaAdapter removed — JWT strategy does not need DB session storage
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })

        if (!user || !user.passwordHash) return null
        if (!user.isActive) return null

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!valid) return null

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role ?? undefined,
          clientId: user.clientId ?? undefined,
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    GitHub({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') {
        // OAuth — upsert user in DB
        await prisma.user.upsert({
          where: { email: user.email! },
          update: { name: user.name, image: user.image },
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
            role: 'client_contact', // default role for OAuth users
            isActive: true,
          },
        })
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        // On sign in, fetch role from DB
        const dbUser = await prisma.user.findUnique({ where: { email: token.email! } })
        token.role = dbUser?.role ?? undefined
        token.clientId = dbUser?.clientId ?? undefined
        token.sub = dbUser?.id ?? token.sub
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role
        session.user.clientId = token.clientId
      }
      return session
    },
  },
})
