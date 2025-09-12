'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

export function QRCode({ value, size = 200, className }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return

      try {
        // Dynamic import to avoid SSR issues
        const QRCodeLib = await import('qrcode')
        
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, size, size)

        // Generate QR code
        await QRCodeLib.toCanvas(canvas, value, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    generateQR()
  }, [value, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={cn('border border-border rounded-lg', className)}
      aria-label={`QR code for ${value}`}
    />
  )
}
