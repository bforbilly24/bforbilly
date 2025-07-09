'use client'

import React, { useState } from 'react'
import { GuestBookThread } from '@/components/molecules/guest-book-thread'
import { GuestBookSkeleton } from '@/components/atoms/guest-book-card'
import { DeleteConfirmation } from '@/components/molecules/delete-confirmation'
import { Card } from '@/components/atoms/card'
import { UserResource } from '@clerk/types'
import { type NestedComment } from '@/lib/comments'

interface GuestBookListProps {
  entries: NestedComment[]
  loading?: boolean
  emptyMessage?: string
  onReply?: (message: string, parentId?: string) => Promise<void>
  onEdit?: (entry: NestedComment) => void
  onDelete?: (entryId: string) => Promise<void>
  currentUser?: UserResource | null
  isAdmin?: boolean
  expandedThreads?: Set<string>
  onToggleExpand?: (entryId: string) => void
}

export function GuestBookList({ 
  entries, 
  loading = false, 
  emptyMessage = "No messages yet. Be the first to leave a message!",
  onReply,
  onEdit,
  onDelete,
  currentUser,
  isAdmin = false,
  expandedThreads = new Set(),
  onToggleExpand
}: GuestBookListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; entryId?: string }>({
    isOpen: false
  })

  const handleStartReply = (entryId: string) => {
    setReplyingTo(entryId);
  }

  const handleCancelReply = () => {
    setReplyingTo(null);
  }

  const handleReply = async (message: string, parentId?: string) => {
    if (onReply) {
      await onReply(message, parentId)
      setReplyingTo(null)
    }
  }

  const handleDeleteClick = async (entryId: string) => {
    setDeleteDialog({ isOpen: true, entryId })
  }

  const handleDeleteConfirm = async () => {
    if (onDelete && deleteDialog.entryId) {
      await onDelete(deleteDialog.entryId)
    }
    setDeleteDialog({ isOpen: false })
  }

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[...Array(3)].map((_, i) => (
          <GuestBookSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <Card className="p-4 sm:p-6 lg:p-8 text-center">
        <div className="space-y-2 sm:space-y-3">
          <p className="text-sm sm:text-base text-muted-foreground">
            {emptyMessage}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/70">
            💬 Start the conversation!
          </p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {entries.map((entry) => (
          <GuestBookThread
            key={entry.id}
            entry={entry}
            isAdmin={isAdmin}
            currentUser={currentUser}
            replyingTo={replyingTo}
            onReply={handleReply}
            onEdit={onEdit}
            onDelete={handleDeleteClick}
            onStartReply={handleStartReply}
            onCancelReply={handleCancelReply}
            expandedThreads={expandedThreads}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog({ isOpen: open })}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}