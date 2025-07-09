'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Smile } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { Textarea } from '@/components/atoms/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/atoms/avatar'
import { cn } from '@/lib/utils'
import NoSSR from '@/components/atoms/no-ssr'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { useTheme } from 'next-themes'
import { AnimatePresence, motion } from 'motion/react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  userImage?: string
  userName?: string
}

// Animated placeholders for guest book messages
const guestBookPlaceholders = [
  "Share your thoughts about my portfolio...",
  "Leave feedback or suggestions...", 
  "What's your impression of my work?",
  "Tell me about your project ideas...",
  "Any advice for my development journey?",
  "Connect and say hello...",
  "What technologies should I explore?",
  "Share your coding experience...",
]

export function ChatInput({ 
  onSendMessage, 
  placeholder,
  disabled = false,
  className,
  userImage,
  userName
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { theme, resolvedTheme } = useTheme()
  
  // Animated placeholder state
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Vanish effect state
  const [animating, setAnimating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const newDataRef = useRef<any[]>([])
  
  // Use animated placeholders - prioritize animation over single placeholder
  const placeholders = guestBookPlaceholders
  
  // Determine emoji picker theme
  const emojiPickerTheme = (resolvedTheme === 'dark' || theme === 'dark') ? Theme.DARK : Theme.LIGHT

  // Vanish effect draw function
  const draw = useCallback(() => {
    if (!textareaRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(textareaRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(message, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [message]);

  // Vanish animation function
  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          // Animation completed
          setMessage("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  // Vanish and submit function
  const vanishAndSubmit = () => {
    if (!message.trim() || disabled || animating) return;
    
    setAnimating(true);
    draw();

    if (message && textareaRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      animate(maxX);
      
      // Send message after animation completes
      setTimeout(() => {
        onSendMessage(message.trim());
        setShowEmojiPicker(false);
      }, 1000); // Wait for animation to complete
    }
  };

  // Placeholder animation logic
  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => {
        const next = (prev + 1) % placeholders.length;
        return next;
      });
    }, 3000)
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    } else if (document.visibilityState === "visible") {
      startAnimation()
    }
  }

  // Start placeholder animation
  useEffect(() => {
    startAnimation()
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, []) // Remove placeholders dependency

  // Update draw effect when message changes
  useEffect(() => {
    draw();
  }, [message, draw]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSend = () => {
    vanishAndSubmit();
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !animating) {
      e.preventDefault()
      vanishAndSubmit();
    }
  }

  const handleEmojiClick = (emojiData: any) => {
    if (!animating) {
      setMessage(prev => prev + emojiData.emoji)
      textareaRef.current?.focus()
    }
  }

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showEmojiPicker])

  return (
    <div className={cn("relative", className)}>
      {/* Professional Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker-container absolute bottom-full mb-2 right-0 z-50 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <NoSSR fallback={<div className="p-4 text-center text-gray-500">Loading emojis...</div>}>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={emojiPickerTheme}
              searchDisabled={false}
              skinTonesDisabled={false}
              autoFocusSearch={false}
              width={350}
              height={400}
              previewConfig={{
                showPreview: false
              }}
              searchPlaceHolder="Search emojis..."
            />
          </NoSSR>
        </div>
      )}

      {/* Input Container */}
      <div className="flex items-end gap-3 p-4 bg-background border-t">
        {/* User Avatar */}
        {userImage && (
          <div className="flex-shrink-0 mb-1">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={userImage}
                alt={userName || 'User'}
              />
              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                {userName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Message Input with Animated Placeholder */}
        <div className="flex-1 relative">
          <div className="relative">
            {/* Canvas for vanish effect */}
            <canvas
              className={cn(
                "absolute pointer-events-none text-base transform scale-50 top-2 left-4 origin-top-left filter invert dark:invert-0 z-40",
                !animating ? "opacity-0" : "opacity-100"
              )}
              ref={canvasRef}
            />
            
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (!animating) {
                  setMessage(e.target.value);
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="" // Remove default placeholder for custom animation
              disabled={disabled || animating}
              className={cn(
                "min-h-[44px] max-h-[120px] resize-none pr-12 py-3 px-4 rounded-xl border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-gray-500 bg-background text-foreground transition-colors relative z-20",
                animating && "text-transparent"
              )}
              rows={1}
            />
            
            {/* Animated Placeholder */}
            {!message && !animating && (
              <div className="absolute inset-0 flex items-center pl-4 pointer-events-none z-30 bg-background/20">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`placeholder-${currentPlaceholder}`}
                    initial={{
                      y: 5,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    exit={{
                      y: -15,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "linear",
                    }}
                    className="text-gray-500 text-sm truncate font-normal"
                  >
                    {placeholders[currentPlaceholder]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>
          
          {/* Emoji Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled || animating}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-background rounded-xl z-10"
          >
            <Smile className={cn(
              "size-5 transition-colors",
              showEmojiPicker ? "text-blue-500" : "text-gray-500"
            )} />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || animating}
          className="flex-shrink-0 h-11 w-11 p-0 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 mb-1 transition-colors"
        >
          <Send className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  )
}
