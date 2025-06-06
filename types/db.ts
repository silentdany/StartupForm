import { Prisma, Role } from '@prisma/client'

// User types with relations
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    accounts: true
    sessions: true
    goals: true
  }
}>

// Goal types
export type GoalWithUser = Prisma.GoalGetPayload<{
  include: {
    user: true
  }
}>

export type GoalStatus = 'active' | 'shipped' | 'failed'

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
export type CreateGoalInput = Prisma.GoalCreateInput
export type UpdateGoalInput = Prisma.GoalUpdateInput
