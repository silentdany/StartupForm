import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    goalId: string
  }>
}

export async function PUT(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { goalId } = params

    // Check if goal exists and belongs to the user
    const existingGoal = await db.goal.findUnique({
      where: { id: goalId },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    if (existingGoal.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (existingGoal.status !== 'active') {
      return NextResponse.json({ error: 'Goal is not active' }, { status: 400 })
    }

    const updatedGoal = await db.goal.update({
      where: { id: goalId },
      data: { status: 'failed' },
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error('Error failing goal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
