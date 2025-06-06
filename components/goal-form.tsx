'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const goalSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description too long'),
  targetDate: z.string().min(1, 'Target date is required'),
})

type GoalFormData = z.infer<typeof goalSchema>

interface GoalFormProps {
  onSuccess?: () => void
}

export function GoalForm({ onSuccess }: GoalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
  })

  const createGoalMutation = useMutation({
    mutationFn: async (data: GoalFormData) => {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: data.description,
          targetDate: new Date(data.targetDate).toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create goal')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      reset()
      toast.success('Goal created successfully!')
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  function onSubmit(data: GoalFormData) {
    setIsSubmitting(true)
    createGoalMutation.mutate(data)
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Goal</CardTitle>
        <CardDescription>
          Set a goal and commit to shipping it by your target date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What do you want to ship?"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="datetime-local"
              {...register('targetDate')}
            />
            {errors.targetDate && (
              <p className="text-sm text-red-500">
                {errors.targetDate.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || createGoalMutation.isPending}
            className="w-full"
          >
            {isSubmitting || createGoalMutation.isPending
              ? 'Creating...'
              : 'Create Goal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
