'use client'

import { useEffect, useState } from 'react'
import { BarChart2, PieChart, Sigma } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface TextAnalysisProps {
  text: string
  wordCount: number
  sentenceCount: number
}

export default function TextAnalysis({
  text,
  wordCount,
  sentenceCount,
}: TextAnalysisProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Check if we have meaningful text
  const hasText = text.trim().length > 30

  // Animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Calculate readability metrics
  const calculateReadability = () => {
    if (!hasText)
      return { fleschScore: 0, gradeLevel: 'N/A', complexity: 'N/A' }

    // Average sentence length (words per sentence)
    const avgSentenceLength = wordCount / Math.max(1, sentenceCount)

    // Average syllables per word (rough estimation)
    const syllableCount = text
      .toLowerCase()
      .replace(/[^a-z]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .reduce((count, word) => {
        return count + countSyllables(word)
      }, 0)

    const avgSyllablesPerWord = syllableCount / Math.max(1, wordCount)

    // Flesch Reading Ease score
    // Higher scores indicate material that is easier to read
    const fleschScore = Math.max(
      0,
      Math.min(
        100,
        206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord
      )
    )

    // Convert to grade level (approximate)
    let gradeLevel = 'N/A'
    let complexity = 'N/A'

    if (fleschScore >= 90) {
      gradeLevel = '5th grade'
      complexity = 'Very easy to read'
    } else if (fleschScore >= 80) {
      gradeLevel = '6th grade'
      complexity = 'Easy to read'
    } else if (fleschScore >= 70) {
      gradeLevel = '7th grade'
      complexity = 'Fairly easy to read'
    } else if (fleschScore >= 60) {
      gradeLevel = '8th-9th grade'
      complexity = 'Plain English'
    } else if (fleschScore >= 50) {
      gradeLevel = '10th-12th grade'
      complexity = 'Fairly difficult'
    } else if (fleschScore >= 30) {
      gradeLevel = 'College'
      complexity = 'Difficult'
    } else {
      gradeLevel = 'College graduate'
      complexity = 'Very difficult'
    }

    return { fleschScore, gradeLevel, complexity }
  }

  // Helper to count syllables in a word (simplified approach)
  function countSyllables(word: string): number {
    if (!word) return 0

    // Count vowel groups
    const groups = word.match(/[aeiouy]+/g)
    let count = groups ? groups.length : 0

    // Adjust for common patterns
    if (word.length > 3 && word.endsWith('e')) count--
    if (word.length > 5 && word.endsWith('es')) count--
    if (word.length > 5 && word.endsWith('ed')) count--

    // Ensure at least one syllable
    return Math.max(1, count)
  }

  // Calculate the progress color based on score
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-blue-500'
    if (score >= 40) return 'bg-yellow-500'
    if (score >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const { fleschScore, gradeLevel, complexity } = calculateReadability()

  return (
    <Card
      className={`mt-6 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          Text Analysis & Readability
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasText ? (
          // Placeholder state when text is less than 30 characters
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="text-muted-foreground mb-4">
              <BarChart2 className="mx-auto mb-2 h-12 w-12 opacity-30" />
              <p className="font-medium">
                Enter at least 30 characters to see text analysis
              </p>
              <p className="mt-1 text-xs">
                Full analysis requires enough text to make meaningful
                calculations
              </p>
            </div>
          </div>
        ) : (
          // Actual analysis when there's enough text
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Readability Score */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <BarChart2 className="text-primary mr-2 h-4 w-4" />
                  <span className="font-medium">Readability Score</span>
                </div>
                <div className="text-2xl font-semibold">
                  {Math.round(fleschScore)}/100
                </div>
                <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(fleschScore)}`}
                    style={{ width: `${fleschScore}%` }}
                  />
                </div>
                <div className="text-muted-foreground text-sm">
                  {complexity}
                </div>
              </div>

              {/* Reading Level */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <PieChart className="text-primary mr-2 h-4 w-4" />
                  <span className="font-medium">Reading Level</span>
                </div>
                <div className="text-2xl font-semibold">{gradeLevel}</div>
                <div className="text-muted-foreground text-sm">
                  Suitable for readers at this education level
                </div>
              </div>

              {/* Word & Sentence Stats */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Sigma className="text-primary mr-2 h-4 w-4" />
                  <span className="font-medium">Sentence Structure</span>
                </div>
                <div className="text-2xl font-semibold">
                  {Math.round(wordCount / Math.max(1, sentenceCount))}
                </div>
                <div className="text-muted-foreground text-sm">
                  Words per sentence (avg)
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="border-muted text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
              <p className="text-center">
                Readability scores use Flesch Reading Ease formula. Higher
                scores indicate easier readability.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
