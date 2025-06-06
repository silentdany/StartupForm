import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    goalId: string
  }>
}

const flameSchema = z.object({
  message: z.string().optional(),
})

export async function POST(request: NextRequest, props: RouteParams) {
  const params = await props.params
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { goalId } = params
    const body = await request.json()
    const { message } = flameSchema.parse(body)

    // Check if goal exists and is failed or overdue
    const existingGoal = await db.goal.findUnique({
      where: { id: goalId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Check if goal is failed OR overdue active
    const now = new Date()
    const isOverdue =
      new Date(existingGoal.targetDate) < now &&
      existingGoal.status === 'active'

    if (existingGoal.status !== 'failed' && !isOverdue) {
      return NextResponse.json(
        { error: 'Goal must be failed or overdue to flame' },
        { status: 400 }
      )
    }

    // Can't flame your own goal
    if (existingGoal.userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot flame your own goal' },
        { status: 400 }
      )
    }

    // Check if user already flamed this goal
    const existingFlame = await db.flame.findFirst({
      where: {
        senderId: session.user.id,
        goalId: goalId,
      },
    })

    if (existingFlame) {
      return NextResponse.json(
        { error: 'Already flamed this goal' },
        { status: 400 }
      )
    }

    // Create the flame
    const flame = await db.flame.create({
      data: {
        senderId: session.user.id,
        recipientId: existingGoal.userId,
        goalId: goalId,
        message: message || undefined,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(flame, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating flame:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
