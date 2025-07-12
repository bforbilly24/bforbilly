import { Skeleton } from '@/components/atoms/skeleton'
import { cn } from '@/lib/utils'

interface GuestBookCardSkeletonProps {
  isReply?: boolean
  hasReplies?: boolean
  showNestedReply?: boolean
}

export function GuestBookCardSkeleton({ 
  isReply = false, 
  hasReplies = false,
  showNestedReply = false 
}: GuestBookCardSkeletonProps) {
  return (
    <div
      className={cn(
        'relative flex w-full min-w-0 max-w-full flex-col gap-1 overflow-hidden rounded-lg border p-1.5 backdrop-blur-md transition-all duration-300 hover:shadow-lg sm:gap-3 sm:p-2 md:p-4',
        isReply
          ? 'border-l-4 border-l-blue-200 dark:border-l-blue-400 bg-gradient-to-r from-blue-50/90 to-blue-50/30 dark:from-blue-900/40 dark:to-blue-900/20 shadow-sm'
          : 'border-border bg-card/95 shadow-md'
      )}
    >
      {/* Header matching the real component layout */}
      <div className="flex min-w-0 flex-row items-start justify-between gap-1 sm:gap-2">
        <div className="flex min-w-0 flex-1 items-center space-x-1 sm:space-x-2">
          {/* Avatar - much smaller to match real component */}
          <Skeleton className="h-5 w-5 shrink-0 rounded-full sm:h-7 sm:w-7 md:h-9 md:w-9" />
          
          <div className="min-w-0 flex-1">
            {/* Name and badges row */}
            <div className="flex min-w-0 items-center gap-1 sm:gap-2">
              <Skeleton className="h-3 w-16 sm:h-4 sm:w-20 md:w-24" />
              {/* Random badge/verification indicator */}
              {Math.random() > 0.7 && (
                <Skeleton className="h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3 md:h-4 md:w-4" />
              )}
            </div>
            
            {/* Timestamp and ID row */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <Skeleton className="h-2.5 w-12 sm:h-3 sm:w-16" />
              <Skeleton className="h-2.5 w-8 sm:h-3 sm:w-10" />
              <Skeleton className="h-2.5 w-8 rounded" />
            </div>
          </div>
        </div>
        
        {/* Action buttons - smaller and right-aligned */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Skeleton className="h-4 w-4 rounded sm:h-5 sm:w-5 md:h-7 md:w-7" />
          <Skeleton className="h-4 w-4 rounded sm:h-5 sm:w-5 md:h-7 md:w-7" />
          <Skeleton className="h-2.5 w-2.5 rounded sm:h-3.5 sm:w-3.5 md:h-4.5 md:w-4.5" />
        </div>
      </div>

      {/* Reply indicator for reply messages */}
      {isReply && (
        <div className="mb-1.5 flex items-center gap-1 rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 p-1 sm:mb-2 sm:p-2">
          <Skeleton className="h-2 w-2 rounded sm:h-2.5 sm:w-2.5" />
          <Skeleton className="h-2.5 w-20 sm:h-3 sm:w-24" />
        </div>
      )}

      {/* Message content */}
      <div className="min-w-0 break-words leading-normal">
        <div className="flex min-w-0 flex-col">
          <div className="min-w-0 whitespace-pre-wrap break-words">
            {/* @mention for replies */}
            {isReply && (
              <Skeleton className="mr-1 inline-block h-3 w-12 rounded sm:h-3.5 sm:w-16" />
            )}
            
            {/* Message lines with varied lengths */}
            <div className="space-y-1 sm:space-y-1.5">
              <Skeleton className="h-2.5 w-full sm:h-3 md:h-3.5" />
              <Skeleton className={cn("h-2.5 sm:h-3 md:h-3.5", 
                Math.random() > 0.5 ? "w-[85%]" : "w-[92%]"
              )} />
              {Math.random() > 0.4 && (
                <Skeleton className={cn("h-2.5 sm:h-3 md:h-3.5",
                  Math.random() > 0.6 ? "w-[60%]" : "w-[75%]"
                )} />
              )}
              {/* Inline edited badge sometimes */}
              {Math.random() > 0.8 && (
                <Skeleton className="ml-1 inline-block h-3 w-10 rounded-full sm:ml-2 sm:h-3.5 sm:w-12" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Replies section for parent messages */}
      {hasReplies && (
        <div className="mt-2 sm:mt-4">
          {/* Replies counter */}
          <div className="flex w-full items-center gap-1 rounded-md border-t border-border p-1.5 pt-2 sm:gap-2 sm:p-2 sm:pt-3">
            <Skeleton className="h-2.5 w-2.5 rounded sm:h-3 sm:w-3" />
            <Skeleton className="h-2.5 w-2.5 rounded sm:h-3 sm:w-3" />
            <Skeleton className="h-2.5 w-12 sm:h-3 sm:w-16" />
          </div>

          {/* Optional nested reply preview */}
          {showNestedReply && (
            <div className="space-y-1.5 pt-1.5 sm:space-y-3 sm:pt-3">
              <div className="relative min-w-0">
                <GuestBookCardSkeleton isReply={true} hasReplies={false} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
