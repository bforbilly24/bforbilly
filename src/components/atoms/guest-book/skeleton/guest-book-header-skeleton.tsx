import { Skeleton } from '@/components/atoms/skeleton'
import { Card, CardHeader } from '@/components/atoms/card'

export function GuestBookHeaderSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 rounded" />
            <Skeleton className="h-5 w-24 sm:h-6 sm:w-32" />
            <Skeleton className="h-4 w-16 sm:h-5 sm:w-20 rounded-full" />
          </div>
          
          {/* Connection status */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-12 sm:h-4 sm:w-16" />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
