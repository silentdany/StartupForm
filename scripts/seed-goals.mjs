import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedGoals() {
  try {
    console.log('🌱 Seeding test goals...')

    // Check if we have any users
    let userCount = await prisma.user.count()
    console.log(`Found ${userCount} users in the database`)

    let firstUser
    if (userCount === 0) {
      console.log('Creating a test user...')
      firstUser = await prisma.user.create({
        data: {
          id: 'test-user-1',
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      console.log(
        `✅ Created test user: ${firstUser.name} (${firstUser.email})`
      )
    } else {
      firstUser = await prisma.user.findFirst()
      console.log(`Using existing user: ${firstUser.name} (${firstUser.email})`)
    }

    // Check if this user already has goals
    const existingGoals = await prisma.goal.count({
      where: { userId: firstUser.id },
    })

    if (existingGoals > 0) {
      console.log(`User already has ${existingGoals} goals. Skipping seeding.`)
      return
    }

    // Create some test goals with different statuses and dates
    const testGoals = [
      {
        description: 'Build a responsive landing page for my startup',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        status: 'active',
        userId: firstUser.id,
      },
      {
        description: 'Launch my first npm package',
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        status: 'active',
        userId: firstUser.id,
      },
      {
        description: 'Write 10 blog posts about web development',
        targetDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
        status: 'active',
        userId: firstUser.id,
      },
      {
        description: 'Complete the TypeScript course',
        targetDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        status: 'shipped',
        userId: firstUser.id,
      },
      {
        description: 'Build a mobile app with React Native',
        targetDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        status: 'failed',
        userId: firstUser.id,
      },
    ]

    // Create the goals
    for (const goalData of testGoals) {
      const goal = await prisma.goal.create({
        data: goalData,
      })
      console.log(
        `✅ Created goal: ${goal.description} [${goal.status.toUpperCase()}]`
      )
    }

    console.log('\n🎉 Test goals created successfully!')
    console.log('📊 Summary:')
    console.log(`   - 2 Active goals (1 overdue)`)
    console.log(`   - 1 Shipped goal`)
    console.log(`   - 1 Failed goal`)
    console.log('')
    console.log('🌐 Next steps:')
    console.log('   1. Visit http://localhost:3000 to see the app')
    console.log('   2. Sign in with the test user or create your own account')
    console.log('   3. Visit /dashboard to see your goals')
    console.log('   4. Visit /explore to see public goals')
  } catch (error) {
    console.error('❌ Error seeding goals:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedGoals()
