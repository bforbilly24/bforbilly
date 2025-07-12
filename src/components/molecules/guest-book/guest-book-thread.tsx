'use client'

import React, { useState } from 'react'
import { GuestBookCard } from '@/components/atoms/guest-book'
import { UserResource } from '@clerk/types'
import { type NestedComment } from '@/lib/comments'

interface GuestBookThreadProps {
  entry: NestedComment
  isAdmin?: boolean
  currentUser?: UserResource | null
  onStartReply?: (entryId: string) => void
  onEdit?: (entry: NestedComment) => void
  onDelete?: (entryId: string) => Promise<void>
  depth?: number
  expandedThreads?: Set<string>
  onToggleExpand?: (entryId: string) => void
  isInSheet?: boolean
}

export function GuestBookThread({
  entry,
  isAdmin = false,
  currentUser,
  onStartReply,
  onEdit,
  onDelete,
  depth = 0,
  expandedThreads = new Set(),
  onToggleExpand,
  isInSheet = false
}: GuestBookThreadProps) {
  const handleReply = (entryId?: string) => {
    if (onStartReply) {
      onStartReply(entryId || entry.id);
    }
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <GuestBookCard
        entry={entry}
        isAdmin={isAdmin}
        currentUserId={currentUser?.id}
        onReply={handleReply}
        onEdit={onEdit}
        onDelete={onDelete}
        showReplies={true}
        depth={depth}
        expandedThreads={expandedThreads}
        isInSheet={isInSheet}
      />
    </div>
  )
}
