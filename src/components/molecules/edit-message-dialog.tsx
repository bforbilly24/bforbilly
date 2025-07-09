'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Textarea } from '@/components/atoms/textarea'
import { Label } from '@/components/atoms/label'
import { Save, X } from 'lucide-react'

interface EditMessageDialogProps {
  isOpen: boolean
  onClose: () => void
  initialMessage: string
  onSave: (message: string) => Promise<void>
  isLoading?: boolean
}

export const EditMessageDialog = ({
  isOpen,
  onClose,
  initialMessage,
  onSave,
  isLoading = false
}: EditMessageDialogProps) => {
  const [message, setMessage] = useState(initialMessage)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!message.trim()) return
    
    setIsSaving(true)
    try {
      await onSave(message.trim())
      onClose()
    } catch (error) {
      console.error('Failed to save message:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    setMessage(initialMessage)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[85vh] p-4 sm:p-6">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="text-lg sm:text-xl">Edit Message</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Make changes to your message. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2 sm:py-4">
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm sm:text-base">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Edit your message..."
              className="min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
              disabled={isSaving || isLoading}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 sm:space-x-0">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSaving || isLoading}
            className="gap-2 text-sm sm:text-base order-2 sm:order-1"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!message.trim() || isSaving || isLoading}
            className="gap-2 text-sm sm:text-base order-1 sm:order-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}