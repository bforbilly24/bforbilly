import { GuestBookCardSkeleton, GuestBookHeaderSkeleton } from '@/components/atoms/guest-book/skeleton'
import { ChatInputSkeleton } from '@/components/atoms/skeleton/chat-input-skeleton'

export function GuestBookSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="flex-shrink-0 p-2 pb-1 sm:p-4 sm:pb-2">
        <GuestBookHeaderSkeleton />
      </div>

      {/* Messages Section */}
      <div className="flex-1 px-2 sm:px-4 sm:pb-4">
        <div className="h-[calc(100vh-200px)] w-full space-y-4 sm:space-y-6">
          {[...Array(5)].map((_, i) => {
            // Create varied skeleton patterns
            const isReply = i === 1 || i === 3; // Some cards are replies
            const hasReplies = i === 0 || i === 2; // Some cards have replies
            const showNestedReply = hasReplies && Math.random() > 0.5; // Sometimes show nested reply
            
            return (
              <GuestBookCardSkeleton 
                key={`page-skeleton-${i}`}
                isReply={isReply}
                hasReplies={hasReplies}
                showNestedReply={showNestedReply}
              />
            );
          })}
        </div>
      </div>
      
      {/* Input Section */}
      <div className="sticky bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm flex-shrink-0">
        <ChatInputSkeleton />
      </div>
    </div>
  )
}
