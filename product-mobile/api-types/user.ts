// Mirror of backend/api/modules/users/types.ts (Zod removido).

export type UserRole = 'ADMIN' | 'PREMIUM' | 'REGULAR' | 'FREE' | 'PROFESSIONAL' | 'SPECIAL'

export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  emailVerified: Date | null
  role: UserRole
  phone?: string | null
  bio?: string | null
  address?: string | null
  zipCode?: string | null
  neighborhood?: string | null
  addressComplement?: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  version: number
}
