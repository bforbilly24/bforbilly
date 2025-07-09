import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { Button } from '@/components/atoms/button'
import { Textarea } from '@/components/atoms/textarea'
import { Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface CommentInputProps {
  userImage?: string
  userName?: string
  onSubmit: (message: string) => void
  placeholder?: string
  disabled?: boolean
  onCancel?: () => void
}

// Animated placeholders for comment input
const commentPlaceholders = [
  "Leave a message...",
  "Share your thoughts...",
  "What's on your mind?",
  "Write something inspiring...",
  "Tell your story...",
  "Share your experience...",
  "Add your comment...",
  "What would you like to say?",
]

export function CommentInput({ 
  userImage, 
  userName, 
  onSubmit, 
  placeholder,
  disabled = false,
  onCancel
}: CommentInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Animated placeholder state
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Vanish effect state
  const [animating, setAnimating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const newDataRef = useRef<any[]>([])
  
  // Use animated placeholders if no custom placeholder provided
  const placeholders = placeholder ? [placeholder] : commentPlaceholders

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
      
      // Submit after a short delay to allow vanish effect to start
      setTimeout(() => {
        onSubmit(message.trim());
      }, 100);
    }
  };

  // Placeholder animation logic
  const startAnimation = () => {
    if (placeholders.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
      }, 3000)
    }
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
    if (placeholders.length > 1) {
      startAnimation()
      document.addEventListener("visibilitychange", handleVisibilityChange)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        document.removeEventListener("visibilitychange", handleVisibilityChange)
      }
    }
  }, [placeholders])

  // Update draw effect when message changes
  useEffect(() => {
    if (message) {
      draw();
    }
  }, [message, draw]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    vanishAndSubmit();
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !animating) {
      e.preventDefault()
      vanishAndSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
      <div className="flex items-start gap-2 sm:gap-3">
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 mt-1">
          <AvatarImage src={userImage} alt={userName || 'User'} />
          <AvatarFallback className="text-xs sm:text-sm">
            {(userName || 'U')[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 relative">
          {/* Canvas for vanish effect */}
          <canvas
            className={cn(
              "absolute pointer-events-none text-base transform scale-50 top-[10%] left-2 origin-top-left filter invert dark:invert-0 pr-20 z-10",
              !animating ? "opacity-0" : "opacity-100"
            )}
            ref={canvasRef}
          />
          
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                if (!animating) {
                  setMessage(e.target.value);
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="" // Remove default placeholder for custom animation
              className={cn(
                "min-h-[60px] sm:min-h-[80px] resize-none text-sm sm:text-base border-input transition-colors",
                animating && "text-transparent"
              )}
              disabled={disabled || animating}
              required
            />
            
            {/* Animated Placeholder */}
            {!message && (
              <div className="absolute inset-0 flex items-center pl-3 pt-3 pointer-events-none">
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
                    className="text-muted-foreground text-sm sm:text-base truncate"
                  >
                    {placeholders[currentPlaceholder]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button 
            type="button"
            variant="ghost"
            onClick={onCancel}
            size="sm"
            className="text-xs sm:text-sm px-2 sm:px-3"
            disabled={animating}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={disabled || !message.trim() || animating}
          size="sm"
          className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 group/send-btn relative overflow-hidden"
        >
          {/* Text that slides out on hover */}
          <span className="group-hover/send-btn:translate-x-40 transition duration-500 flex items-center gap-1 sm:gap-2">
            <span className="hidden sm:inline">
              {onCancel ? 'Reply' : 'Send Message'}
            </span>
            <span className="sm:hidden">
              {onCancel ? 'Reply' : 'Send'}
            </span>
          </span>
          
          {/* Icon that slides in from left on hover */}
          <div className="-translate-x-40 group-hover/send-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 z-20">
            <Send className="size-4 sm:size-5" />
          </div>
        </Button>
      </div>
    </form>
  )
}