import { Providers } from '@/components/providers'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <main className="flex-1">{children}</main>
    </Providers>
  )
}
