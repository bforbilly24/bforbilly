'use client'

import React, { useState } from 'react'
import { GuestBookCard } from '@/components/atoms/guest-book-card'
import { CommentInput } from '@/components/atoms/comment-input'
import { Card } from '@/components/atoms/card'
import { UserResource } from '@clerk/types'
import { CornerDownRight } from 'lucide-react'
import { type NestedComment } from '@/lib/comments'

interface GuestBookThreadProps {
  entry: NestedComment
  isAdmin?: boolean
  currentUser?: UserResource | null
  replyingTo?: string | null
  onReply?: (message: string, parentId?: string) => Promise<void>
  onEdit?: (entry: NestedComment) => void
  onDelete?: (entryId: string) => Promise<void>
  onStartReply?: (entryId: string) => void
  onCancelReply?: () => void
  depth?: number
  expandedThreads?: Set<string>
  onToggleExpand?: (entryId: string) => void
}

export function GuestBookThread({
  entry,
  isAdmin = false,
  currentUser,
  replyingTo,
  onReply,
  onEdit,
  onDelete,
  onStartReply,
  onCancelReply,
  depth = 0,
  expandedThreads = new Set(),
  onToggleExpand
}: GuestBookThreadProps) {
  // Use expanded state from props instead of local state
  const isExpanded = expandedThreads.has(entry.id)

  const handleReply = async (message: string) => {
    if (onReply) {
      // Always use the current entry's ID as the parent for the reply
      // This ensures that replies are correctly attributed to the specific comment being replied to
      await onReply(message, entry.id)
      onCancelReply?.()
    }
  }

  const handleStartReply = (entryId?: string) => {
    // Use the provided entryId if available, otherwise use the current entry's ID
    const targetEntryId = entryId || entry.id;
    onStartReply?.(targetEntryId);
  }

  // Render reply input for this specific entry
  const renderReplyInput = () => {
    if (replyingTo === entry.id && currentUser) {
      // Determine who we're replying to based on the replyingTo ID
      const replyTargetName = entry.authorName;
      
      return (
        <div className={`mt-3 ${depth > 0 ? 'ml-2' : 'ml-6'}`}>
          <Card className="p-4 border-blue-200 bg-blue-50/30 dark:border-blue-700 dark:bg-blue-950/30 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-3 uppercase tracking-wide dark:text-blue-400">
              <CornerDownRight className="w-3 h-3" />
              Replying to {replyTargetName}
            </div>
            <CommentInput
              userImage={currentUser.imageUrl}
              userName={currentUser.fullName || currentUser.firstName || 'User'}
              onSubmit={handleReply}
              placeholder={`Write your reply to ${replyTargetName}...`}
              onCancel={onCancelReply}
            />
          </Card>
        </div>
      )
    }
    
    return null
  }

  return (
    <div className="space-y-3">
      <GuestBookCard
        entry={entry}
        isAdmin={isAdmin}
        currentUserId={currentUser?.id}
        onReply={handleStartReply}
        onEdit={onEdit}
        onDelete={onDelete} // Pass through the original delete handler, don't wrap it
        showReplies={true}
        replyingTo={replyingTo}
        onStartReply={onStartReply}
        onCancelReply={onCancelReply}
        onSubmitReply={onReply}
        currentUser={currentUser}
        depth={depth}
        isExpanded={isExpanded}
        onToggleExpand={() => onToggleExpand?.(entry.id)}
        expandedThreads={expandedThreads}
      />
      
      {/* GuestBookCard now handles reply input, so we don't need this anymore */}
    </div>
  )
}