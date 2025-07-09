'use client'

import React, { useEffect, useState } from 'react'
import { GuestBookCard } from '@/components/atoms/guest-book-card'
import { MessageCircle, Lock } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { SignInButton } from '@clerk/nextjs'
import { ENDPOINTS } from '@/api/endpoints'

type GuestBookEntry = {
  id: string
  message: string
  authorId: string
  authorName: string
  authorImage?: string
  createdAt: string
  updatedAt: string
  parentId?: string
  repliedToUserId?: string
  repliedToUserName?: string
  replies?: GuestBookEntry[]
  parent?: GuestBookEntry
}

type CommentPreviewProps = {
  entries?: GuestBookEntry[]
  loading?: boolean
}

export function CommentPreview({ entries: externalEntries, loading: externalLoading }: CommentPreviewProps = {}) {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jika ada external entries, gunakan itu
    if (externalEntries !== undefined) {
      setEntries(externalEntries);
      setLoading(externalLoading ?? false);
      return;
    }

    // Jika tidak ada external entries, fetch sendiri
    const fetchEntries = async () => {
      try {
        const response = await fetch(ENDPOINTS.LOCAL.GUEST_BOOK);
        const result = await response.json();
        if (result.success) {
          setEntries(result.data);
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [externalEntries, externalLoading]);
  // Show the 4 most recent comments (only root comments, no replies)
  const previewEntries = entries.filter(entry => !entry.parentId).slice(0, 4)

  if (loading) {
    return (
      <aside className="w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="size-6 text-primary" />
            <h2 className="text-xl font-bold">Comment Preview</h2>
          </div>
          <p className="text-muted-foreground text-sm">Loading komentar terbaru...</p>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full size-8 border-b-2 border-primary"></div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center gap-2">
          <MessageCircle className="size-5 sm:h-6 sm:w-6 text-primary" />
          <h2 className="text-lg sm:text-xl font-bold">Comment Preview</h2>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl mx-auto px-4">
          Lihat apa kata pengunjung tentang portfolio ini
        </p>
      </div>

      {/* Guest Book Cards in Single Column with Central Lock */}
      <div className="min-h-[600px] w-full relative">
        {previewEntries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 w-full">
              {previewEntries.map((entry, index) => (
                <div key={entry.id} className="relative">
                  <GuestBookCard
                    entry={entry}
                    isAdmin={false}
                    className="pointer-events-none opacity-80 hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
            </div>
            {/* Single Central Lock overlay for all comments */}
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <Lock className="size-8 text-muted-foreground mx-auto" />
                <p className="text-base text-muted-foreground font-medium">
                  Login to see full conversation
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
            <p className="text-muted-foreground mb-4">
              Belum ada komentar. Jadilah yang pertama berbagi pendapat!
            </p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-muted/30 to-muted/50 rounded-lg border">
        <div className="space-y-3">
          <h3 className="font-semibold text-base sm:text-lg">Bergabung dalam percakapan</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {entries.length > 0 
              ? `${entries.length} orang sudah memberikan feedback` 
              : "Jadilah yang pertama memberikan feedback"
            }
          </p>
          <SignInButton mode="modal">
            <Button variant="default" size="sm" className="gap-2">
              <MessageCircle className="size-4" />
              Join Conversation
            </Button>
          </SignInButton>
        </div>
      </div>

      {entries.length > 4 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            +{entries.length - 4} komentar lainnya menunggu Anda
          </p>
        </div>
      )}
    </aside>
  )
}
