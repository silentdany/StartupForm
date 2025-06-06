'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Project {
  id: string
  name: string
}

const goalSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .refine(
      (val) => val.trim().length >= 10,
      'Description must be at least 10 meaningful characters'
    ),
  targetDate: z
    .string()
    .min(1, 'Target date is required')
    .refine((val) => {
      const date = new Date(val)
      const now = new Date()
      // Add 1 hour minimum in the future
      const minDate = new Date(now.getTime() + 60 * 60 * 1000)
      return date > minDate
    }, 'Target date must be at least 1 hour in the future')
    .refine((val) => {
      const date = new Date(val)
      const now = new Date()
      // Max 2 years in the future
      const maxDate = new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000)
      return date <= maxDate
    }, 'Target date cannot be more than 2 years in the future'),
  projectId: z.string().optional(),
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
  })

  // Fetch user's projects for selection
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      return response.json()
    },
  })

  const descriptionValue = watch('description', '')
  const projectIdValue = watch('projectId', '')

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
          projectId: data.projectId === 'none' ? null : data.projectId || null,
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
            <Label htmlFor="description">Goal Description</Label>
            <div className="relative">
              <Input
                id="description"
                placeholder="e.g., Launch my productivity app with user authentication"
                className={errors.description ? 'border-red-500' : ''}
                {...register('description')}
              />
              <div className="mt-1 flex justify-between">
                <div>
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  {descriptionValue.length || 0}/500
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Completion Date</Label>
            <Input
              id="targetDate"
              type="datetime-local"
              className={errors.targetDate ? 'border-red-500' : ''}
              {...register('targetDate')}
            />
            {errors.targetDate && (
              <p className="text-sm text-red-500">
                {errors.targetDate.message}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              Choose a realistic deadline. You&apos;ll be publicly accountable
              for this!
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">Project (Optional)</Label>
            <Select
              value={projectIdValue}
              onValueChange={(value) => setValue('projectId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Link to a project (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No project</SelectItem>
                {projects?.map((project: Project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Link this goal to one of your projects to showcase your work.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || createGoalMutation.isPending}
            className="w-full"
          >
            {isSubmitting || createGoalMutation.isPending
              ? 'Creating Goal...'
              : 'Create Goal & Ship It! 🚀'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
