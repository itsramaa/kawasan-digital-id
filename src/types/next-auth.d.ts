import type { UserRole } from '@prisma/client'
import type { DefaultSession, DefaultUser } from 'next-auth'
import type { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User extends DefaultUser {
    role?: UserRole
    clientId?: string | null
  }
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string
      role?: UserRole
      clientId?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role?: UserRole
    clientId?: string | null
  }
}
