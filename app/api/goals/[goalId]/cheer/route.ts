import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    goalId: string
  }>
}

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

    // Check if goal exists
    const existingGoal = await db.goal.findUnique({
      where: { id: goalId },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Check if user already cheered this goal
    const existingCheer = await db.cheer.findUnique({
      where: {
        userId_goalId: {
          userId: session.user.id,
          goalId: goalId,
        },
      },
    })

    if (existingCheer) {
      return NextResponse.json({ error: 'Already cheered' }, { status: 400 })
    }

    // Create the cheer
    const cheer = await db.cheer.create({
      data: {
        userId: session.user.id,
        goalId: goalId,
      },
    })

    return NextResponse.json(cheer, { status: 201 })
  } catch (error) {
    console.error('Error creating cheer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, props: RouteParams) {
  const params = await props.params
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { goalId } = params

    // Find and delete the cheer
    const existingCheer = await db.cheer.findUnique({
      where: {
        userId_goalId: {
          userId: session.user.id,
          goalId: goalId,
        },
      },
    })

    if (!existingCheer) {
      return NextResponse.json({ error: 'Cheer not found' }, { status: 404 })
    }

    await db.cheer.delete({
      where: {
        id: existingCheer.id,
      },
    })

    return NextResponse.json({ message: 'Cheer removed' })
  } catch (error) {
    console.error('Error removing cheer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
