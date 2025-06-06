import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check for authorization header (simple API key protection)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = process.env.CRON_SECRET || 'fallback-secret'

    if (authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()

    // Find all active goals that are past their deadline
    const overdueGoals = await db.goal.findMany({
      where: {
        status: 'active',
        targetDate: {
          lt: now,
        },
      },
      select: {
        id: true,
        description: true,
        targetDate: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    if (overdueGoals.length === 0) {
      return NextResponse.json({
        message: 'No overdue goals found',
        markedAsFailed: 0,
      })
    }

    // Mark all overdue goals as failed
    const result = await db.goal.updateMany({
      where: {
        status: 'active',
        targetDate: {
          lt: now,
        },
      },
      data: {
        status: 'failed',
      },
    })

    console.log(`Marked ${result.count} overdue goals as failed:`)
    overdueGoals.forEach((goal) => {
      console.log(
        `- ${goal.user.name}: "${goal.description}" (due: ${goal.targetDate})`
      )
    })

    return NextResponse.json({
      message: `Successfully marked ${result.count} overdue goals as failed`,
      markedAsFailed: result.count,
      goals: overdueGoals.map((goal) => ({
        id: goal.id,
        description: goal.description,
        targetDate: goal.targetDate,
        userName: goal.user.name,
      })),
    })
  } catch (error) {
    console.error('Error marking overdue goals as failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
