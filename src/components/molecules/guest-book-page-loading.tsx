import { Skeleton } from '@/components/atoms/skeleton'

export default function GuestBookPageLoading() {
  return (
    <div className="p-5 space-y-6">
      {/* Header Loading */}
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      
      {/* Content Loading */}
      <div className="space-y-6">
        {/* Header Card Loading */}
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        
        {/* Chat Messages Loading */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Main Message */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                
                {/* Replies */}
                {i < 2 && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <Skeleton className="h-3 w-16" />
                    <div className="ml-6 space-y-3">
                      {[...Array(i + 1)].map((_, j) => (
                        <div key={j} className="rounded-lg border p-3 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-3 w-24" />
                              <Skeleton className="h-2 w-16" />
                            </div>
                          </div>
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Input Form Loading */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
