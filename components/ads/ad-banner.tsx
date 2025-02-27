'use client'

import { useEffect, useState } from 'react'

import { Card } from '@/components/ui/card'

interface AdBannerProps {
  position: 'top' | 'bottom' | 'sidebar'
}

export default function AdBanner({ position }: AdBannerProps) {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [timeOnPage, setTimeOnPage] = useState(0)

  // Simulate ad loading state
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate ad loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Track time on page for analytics
    const interval = setInterval(() => {
      setTimeOnPage((prev) => prev + 1)
    }, 1000)

    // Track scroll for adaptive ad visibility
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Smart ad logic: Show sidebar ad only after scrolling or after 5 seconds
  const shouldShowSidebarAd =
    position === 'sidebar' && (hasScrolled || timeOnPage > 5)

  // Don't render sidebar ad until conditions are met
  if (position === 'sidebar' && !shouldShowSidebarAd) {
    return null
  }

  // Different ad styles based on position
  const getAdStyles = () => {
    switch (position) {
      case 'top':
        return 'h-24 w-full mb-6'
      case 'bottom':
        return 'h-24 w-full mt-8'
      case 'sidebar':
        return 'w-88 h-[600px] sticky top-4'
      default:
        return 'h-24 w-full'
    }
  }

  // Different ad content based on position
  const getAdContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-muted-foreground text-sm">Ad loading...</p>
        </div>
      )
    }

    switch (position) {
      case 'top':
        return (
          <div className="flex h-full flex-col items-center justify-center p-2">
            <p className="text-muted-foreground mb-1 text-xs">Advertisement</p>
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm">Horizontal Banner Ad (728×90)</p>
            </div>
          </div>
        )
      case 'bottom':
        return (
          <div className="flex h-full flex-col items-center justify-center p-2">
            <p className="text-muted-foreground mb-1 text-xs">Advertisement</p>
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm">Horizontal Banner Ad (728×90)</p>
            </div>
          </div>
        )
      case 'sidebar':
        return (
          <div className="flex h-full flex-col items-center justify-center p-2">
            <p className="text-muted-foreground mb-1 text-xs">Advertisement</p>
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm">Sidebar Ad (300×600)</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm">Ad Content</p>
          </div>
        )
    }
  }

  return (
    <Card
      className={`relative overflow-hidden border transition-all duration-300 ${getAdStyles()} ${
        position === 'sidebar' && hasScrolled
          ? 'opacity-90 hover:opacity-100'
          : 'opacity-100'
      }`}
    >
      {getAdContent()}
    </Card>
  )
}
