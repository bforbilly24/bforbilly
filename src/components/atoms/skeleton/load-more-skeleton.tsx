import { Skeleton } from '@/components/atoms/skeleton'

export function LoadMoreSkeleton() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {[...Array(2)].map((_, i) => (
        <div 
          key={`load-more-${i}`} 
          className="relative flex w-full min-w-0 max-w-full flex-col gap-1 overflow-hidden rounded-lg border border-border bg-card/95 p-1.5 backdrop-blur-md transition-all duration-300 hover:shadow-lg sm:gap-3 sm:p-2 md:p-4 shadow-md"
        >
          {/* Header */}
          <div className="flex min-w-0 flex-row items-start justify-between gap-1 sm:gap-2">
            <div className="flex min-w-0 flex-1 items-center space-x-1 sm:space-x-2">
              <Skeleton className="h-5 w-5 shrink-0 rounded-full sm:h-7 sm:w-7 md:h-9 md:w-9" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <Skeleton className="h-3 w-16 sm:h-4 sm:w-20" />
                  <Skeleton className="h-2 w-10 sm:h-3 sm:w-12" />
                </div>
              </div>
            </div>
            <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded" />
          </div>

          {/* Content */}
          <div className="space-y-1 sm:space-y-2">
            <Skeleton className="h-3 w-full sm:h-4" />
            <Skeleton className="h-3 w-3/4 sm:h-4" />
            <Skeleton className="h-3 w-1/2 sm:h-4" />
          </div>

          {/* Footer */}
          <div className="flex items-center gap-1 pt-1 sm:gap-2 sm:pt-2">
            <Skeleton className="h-5 w-10 sm:h-6 sm:w-12 rounded-full" />
            <Skeleton className="h-5 w-8 sm:h-6 sm:w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
