import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface CounterStatsProps {
  characterCount: number
  characterCountNoSpaces: number
  wordCount: number
  sentenceCount: number
  paragraphCount: number
  averageWordLength: number
  readingTimeMinutes: number
}

export default function CounterStats({
  characterCount,
  characterCountNoSpaces,
  wordCount,
  sentenceCount,
  paragraphCount,
  averageWordLength,
  readingTimeMinutes,
}: CounterStatsProps) {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Text Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <StatItem label="Characters" value={characterCount} />
          <StatItem
            label="Characters (no spaces)"
            value={characterCountNoSpaces}
          />
          <StatItem label="Words" value={wordCount} />
          <StatItem
            label="Avg. Word Length"
            value={averageWordLength.toFixed(1)}
            unit="chars"
          />
          <StatItem label="Sentences" value={sentenceCount} />
          <StatItem label="Paragraphs" value={paragraphCount} />
          <StatItem
            label="Reading Time"
            value={readingTimeMinutes}
            unit={readingTimeMinutes === 1 ? 'min' : 'mins'}
          />
          <StatItem
            label="Speaking Time"
            value={Math.ceil(wordCount / 150)}
            unit="mins"
          />
        </div>

        <Separator className="my-4" />

        <div className="text-muted-foreground mt-2 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Twitter/X:</span>{' '}
            {Math.min(100, Math.floor((280 - characterCount) / 2.8))}% remaining
          </div>
          <div>
            <span className="font-medium">Instagram:</span>{' '}
            {Math.min(100, Math.floor((2200 - characterCount) / 22))}% remaining
          </div>
          <div>
            <span className="font-medium">SMS:</span>{' '}
            {Math.ceil(characterCount / 160)} message
            {characterCount > 160 ? 's' : ''}
          </div>
          <div>
            <span className="font-medium">LinkedIn:</span>{' '}
            {Math.min(100, Math.floor((3000 - characterCount) / 30))}% remaining
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatItemProps {
  label: string
  value: number | string
  unit?: string
}

function StatItem({ label, value, unit }: StatItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-2xl font-semibold">
        {value}
        {unit && (
          <span className="text-muted-foreground text-sm font-normal">
            {' '}
            {unit}
          </span>
        )}
      </p>
    </div>
  )
}
