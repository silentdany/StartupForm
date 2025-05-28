'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { authClient, signOut } from '@/lib/auth-client'

const accountFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

interface AccountFormProps {
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
}

export function AccountForm({ user }: AccountFormProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user.name ?? '',
    },
  })

  const updateProfile = useMutation({
    mutationFn: async (data: AccountFormValues) => {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      return response.json()
    },
    onSuccess: async () => {
      toast.success('Profile updated', {
        description: 'Your profile has been updated successfully.',
      })
      await authClient.signOut()
      router.refresh()
    },
    onError: () => {
      toast.error('Error', {
        description: 'Something went wrong. Please try again.',
      })
    },
  })

  const deleteAccount = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/user', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }
    },
    onSuccess: async () => {
      toast.success('Account deleted', {
        description: 'Your account has been permanently deleted.',
      })
      await signOut()
      router.push('/')
    },
    onError: () => {
      toast.error('Error', {
        description: 'Something went wrong. Please try again.',
      })
    },
    onSettled: () => {
      setShowDeleteDialog(false)
    },
  })

  function onSubmit(data: AccountFormValues) {
    updateProfile.mutate(data)
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your personal information and how it appears on your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
                <AvatarFallback>
                  {user.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" disabled>
                Change Avatar
              </Button>
            </div>
            <Separator />
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Your name"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email ?? ''}
                  disabled
                  className="opacity-50"
                />
                <p className="text-muted-foreground text-sm">
                  Your email address is managed through your Google account.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.refresh()}
              disabled={updateProfile.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-muted-foreground text-sm">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={deleteAccount.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteAccount.mutate()}
                    disabled={deleteAccount.isPending}
                  >
                    {deleteAccount.isPending ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
