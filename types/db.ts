import { Prisma, Role } from '@prisma/client'

// User types with relations
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    accounts: true
    sessions: true
    profile: true
  }
}>

// Profile types
export type ProfileWithUser = Prisma.ProfileGetPayload<{
  include: {
    user: true
  }
}>

// Account types
export type AccountWithUser = Prisma.AccountGetPayload<{
  include: {
    user: true
  }
}>

// Session types
export type SessionWithUser = Prisma.SessionGetPayload<{
  include: {
    user: true
  }
}>

// Role type
export { Role }

// Input types for mutations
export type CreateUserInput = Prisma.UserCreateInput
export type UpdateUserInput = Prisma.UserUpdateInput
export type CreateProfileInput = Prisma.ProfileCreateInput
export type UpdateProfileInput = Prisma.ProfileUpdateInput 