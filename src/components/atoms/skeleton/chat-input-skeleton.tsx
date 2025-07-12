import { Skeleton } from '@/components/atoms/skeleton'
import { Card } from '@/components/atoms/card'

export function ChatInputSkeleton() {
  return (
    <Card className="p-3 sm:p-4 border-t bg-background">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Avatar */}
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        
        {/* Input area */}
        <div className="flex-1">
          <Skeleton className="h-10 sm:h-11 w-full rounded-xl" />
        </div>
        
        {/* Send button */}
        <Skeleton className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex-shrink-0" />
      </div>
    </Card>
  )
}
