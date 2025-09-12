import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { ReviewForm } from '@/components/forms/review-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2 } from 'lucide-react';
import Image from 'next/image';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReviewPage(props: PageProps) {
  const { id } = await props.params;
  
  const supabase = await createClient();
  
  // Fetch business data
  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !business) {
    notFound();
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${business.brand_color}15 0%, ${business.brand_color}08 100%)`
      }}
    >
      <Card className="w-full max-w-md fade-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
              <AvatarImage src={business.logo_url || undefined} />
              <AvatarFallback className="bg-muted">
                <Building2 className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle 
            className="text-2xl"
            style={{ color: business.brand_color }}
          >
            {business.welcome_message || business.name}
          </CardTitle>
          <CardDescription>
            {business.description || 'Share your experience with us'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewForm businessId={id} business={business} />
        </CardContent>
      </Card>
    </div>
  );
}

export async function generateMetadata(props: PageProps) {
  const { id } = await props.params;
  
  const supabase = await createClient();
  
  const { data: business } = await supabase
    .from('businesses')
    .select('name, description')
    .eq('id', id)
    .single();

  return {
    title: business ? `Review ${business.name}` : 'Leave a Review',
    description: business?.description || 'Share your experience with us',
  };
}
