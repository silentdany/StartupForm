import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    goalId: string
  }>
}

const remindSchema = z.object({
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
    const { message } = remindSchema.parse(body)

    // Check if goal exists and is active
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

    if (existingGoal.status !== 'active') {
      return NextResponse.json({ error: 'Goal is not active' }, { status: 400 })
    }

    // Can't remind your own goal
    if (existingGoal.userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot remind your own goal' },
        { status: 400 }
      )
    }

    // Check if goal is nearing deadline (within 24 hours)
    const now = new Date()
    const targetDate = new Date(existingGoal.targetDate)
    const timeDiff = targetDate.getTime() - now.getTime()
    const hoursUntilDeadline = timeDiff / (1000 * 3600)

    if (hoursUntilDeadline > 24) {
      return NextResponse.json(
        { error: 'Goal deadline is not near enough for reminders' },
        { status: 400 }
      )
    }

    if (hoursUntilDeadline < 0) {
      return NextResponse.json(
        { error: 'Goal deadline has passed' },
        { status: 400 }
      )
    }

    // Create the reminder
    const reminder = await db.reminder.create({
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

    return NextResponse.json(reminder, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating reminder:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
