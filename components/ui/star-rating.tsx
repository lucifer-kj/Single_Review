'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  className 
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const handleClick = (newRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(newRating)
    }
  }

  const handleMouseEnter = (newRating: number) => {
    if (!readonly) {
      setHoveredRating(newRating)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
          className={cn(
            'transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            !readonly && 'hover:scale-105 cursor-pointer',
            readonly && 'cursor-default'
          )}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              'transition-colors duration-200',
              star <= displayRating
                ? 'fill-star-filled text-star-filled'
                : 'fill-star-empty text-star-empty',
              !readonly && hoveredRating === star && 'text-star-hover'
            )}
          />
        </button>
      ))}
    </div>
  )
}
