import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Plus, 
  Share2, 
  BarChart3,
  Settings
} from 'lucide-react'
import { CopyButton } from '@/components/ui/copy-button'

export function QuickActions() {
  return (
    <Card className="fade-in">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/dashboard/businesses/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Business
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="justify-start">
            <Link href="/dashboard/reviews">
              <BarChart3 className="w-4 h-4 mr-2" />
              View All Reviews
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="justify-start">
            <Link href="/dashboard/businesses">
              <Settings className="w-4 h-4 mr-2" />
              Manage Businesses
            </Link>
          </Button>
          
          <Button variant="outline" className="justify-start">
            <Share2 className="w-4 h-4 mr-2" />
            Share Review Link
          </Button>
          
          <Button variant="outline" className="justify-start">
            <Share2 className="w-4 h-4 mr-2" />
            Generate QR Code
          </Button>
        </div>
        
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Share your review link:</p>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value="https://crux.app/review/your-business-id" 
              readOnly 
              className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-muted"
            />
            <CopyButton text="https://crux.app/review/your-business-id" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
