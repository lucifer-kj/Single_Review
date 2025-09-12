'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { QRCode } from '@/components/ui/qr-code'
import { CopyButton } from '@/components/ui/copy-button'
import { QrCode, Download } from 'lucide-react'

interface QRModalProps {
  url: string
  businessName: string
}

export function QRModal({ url, businessName }: QRModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDownload = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.download = `${businessName}-qr-code.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="w-4 h-4 mr-2" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for {businessName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <QRCode value={url} size={200} />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Review Link:</p>
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={url}
                readOnly 
                className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-muted"
              />
              <CopyButton text={url} />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
