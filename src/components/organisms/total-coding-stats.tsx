import { getWakaAllTimeStats } from '@/lib/wakatime/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import Link from 'next/link'

export async function TotalCodingStats() {
  const allTime = await getWakaAllTimeStats()
  const totalText = allTime?.data?.text || '0 hrs 0 mins'
  const totalSeconds = allTime?.data?.total_seconds || 0
  const totalMinutes = Math.round(totalSeconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Total Coding Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {totalText}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              All time coding tracked by WakaTime
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-xl font-semibold">
                {totalHours}
              </div>
              <p className="text-sm text-muted-foreground">Hours</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">
                {remainingMinutes}
              </div>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Data provided by{' '}
              <Link 
                href="https://wakatime.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                WakaTime
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
