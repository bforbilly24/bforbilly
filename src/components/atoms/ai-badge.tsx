'use client'

import { Bot, Sparkles } from 'lucide-react'
import { Badge } from '@/components/atoms/badge'
import { motion } from 'framer-motion'

interface AIBadgeProps {
  className?: string
  variant?: 'default' | 'minimal'
}

export function AIBadge({ className = '', variant = 'default' }: AIBadgeProps) {
  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`inline-flex items-center gap-1 ${className}`}
      >
        <div className="flex items-center justify-center w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
          <Bot className="h-2.5 w-2.5 text-white" />
        </div>
        <span className="text-xs text-muted-foreground">AI</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={className}
    >
      <Badge 
        variant="secondary" 
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 gap-1 text-xs font-medium px-2 py-0.5"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-3 w-3" />
        </motion.div>
        AI Assistant
      </Badge>
    </motion.div>
  )
}

export function isAIMessage(authorName?: string): boolean {
  return authorName === 'Billy AI Assistant' || authorName?.includes('AI Assistant') || false
}
