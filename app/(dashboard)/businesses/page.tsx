import { requireAuth } from '@/lib/auth';
import { BusinessManagement } from '@/components/dashboard/business-management';

export default async function BusinessesPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Businesses</h1>
        <p className="text-muted-foreground">
          Manage your business profiles and review settings
        </p>
      </div>
      
      <BusinessManagement />
    </div>
  );
}
