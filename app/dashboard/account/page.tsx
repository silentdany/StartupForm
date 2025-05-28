import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { AccountForm } from '@/components/account-form'
import { DashboardShell } from '@/components/dashboard-shell'
import { auth } from '@/lib/auth'

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

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
