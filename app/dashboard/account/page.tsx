import { redirect } from 'next/navigation'
import { auth } from '@/auth'

import { AccountForm } from '@/components/account-form'
import { DashboardShell } from '@/components/dashboard-shell'

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <DashboardShell
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Account Settings', isCurrentPage: true },
      ]}
    >
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <AccountForm
        user={{
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
        }}
      />
    </DashboardShell>
  )
}
