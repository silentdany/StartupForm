import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  return (
    <div className="container mx-auto p-4 min-h-svh">
      <main className="flex flex-col gap-8 py-8">
        {session ? (
          <>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold">Welcome back, {session.user?.name}</h1>
              <p className="text-muted-foreground">
                You are signed in as {session.user?.email}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>View and manage your profile settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/profile">View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configure your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/settings">Manage Settings</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Support</CardTitle>
                  <CardDescription>Get help with your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="/support">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-8 py-20">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-4xl font-bold">Welcome to Acme Inc.</h1>
              <p className="text-xl text-muted-foreground">
                Sign in to access your dashboard and manage your account.
              </p>
            </div>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
