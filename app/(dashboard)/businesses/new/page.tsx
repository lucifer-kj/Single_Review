import { requireAuth } from '@/lib/auth'
import { BusinessForm } from '@/components/forms/business-form'

export default async function NewBusinessPage() {
  await requireAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Add New Business</h1>
        <p className="text-muted-foreground">
          Create a new business profile to start collecting reviews
        </p>
      </div>
      
      <div className="max-w-2xl">
        <BusinessForm />
      </div>
    </div>
  )
}
