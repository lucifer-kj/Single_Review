'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, Building2, MapPin, Phone, Globe, Star } from 'lucide-react';
import { businessFormSchema, type BusinessFormData } from '@/lib/validations';
import { createClient } from '@/lib/supabase';

interface BusinessFormProps {
  business?: BusinessFormData;
  onSubmit: (data: BusinessFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export function BusinessForm({ business, onSubmit, onCancel, loading = false }: BusinessFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(business?.logo_url || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: business || {
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      google_business_url: '',
      logo_url: '',
      brand_color: '#000000',
      welcome_message: 'Thank you for your feedback!',
      thank_you_message: 'Thank you for taking the time to share your experience with us.',
    },
  });

  const brandColor = watch('brand_color');

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setLogoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    setValue('logo_url', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadLogoToStorage = async (): Promise<string | null> => {
    if (!logoFile) return business?.logo_url || null;

    try {
      setUploading(true);
      const supabase = createClient();
      
      // Generate unique filename
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('business-logos')
        .upload(fileName, logoFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const onFormSubmit = async (data: BusinessFormData) => {
    try {
      // Upload logo if new file selected
      if (logoFile) {
        const logoUrl = await uploadLogoToStorage();
        data.logo_url = logoUrl || '';
      }

      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="w-5 h-5" />
          <span>{business ? 'Edit Business' : 'Create New Business'}</span>
        </CardTitle>
        <CardDescription>
          Set up your business profile and customize your review experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Logo Upload Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Business Logo</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20 border-2 border-border">
                <AvatarImage src={logoPreview || undefined} alt="Business logo" />
                <AvatarFallback className="bg-muted">
                  <Building2 className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </Button>
                {logoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeLogo}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a square logo (recommended: 200x200px, max 5MB)
            </p>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Basic Information</Label>
            
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter your business name"
                className="mobile-form-input"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Brief description of your business"
                rows={3}
                className="mobile-form-input"
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10 mobile-form-input"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="contact@business.com"
                  className="mobile-form-input"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="123 Main St, City, State 12345"
                  className="pl-10 mobile-form-input"
                />
              </div>
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Online Presence */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Online Presence</Label>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="website"
                  {...register('website')}
                  placeholder="https://www.yourbusiness.com"
                  className="pl-10 mobile-form-input"
                />
              </div>
              {errors.website && (
                <p className="text-sm text-destructive">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_business_url">Google Business Profile URL</Label>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="google_business_url"
                  {...register('google_business_url')}
                  placeholder="https://g.page/your-business"
                  className="pl-10 mobile-form-input"
                />
              </div>
              {errors.google_business_url && (
                <p className="text-sm text-destructive">{errors.google_business_url.message}</p>
              )}
            </div>
          </div>

          {/* Branding */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Branding</Label>
            
            <div className="space-y-2">
              <Label htmlFor="brand_color">Brand Color</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="brand_color"
                  type="color"
                  {...register('brand_color')}
                  className="w-16 h-10 p-1 border rounded cursor-pointer"
                />
                <Input
                  {...register('brand_color')}
                  placeholder="#000000"
                  className="flex-1 mobile-form-input"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This color will be used in your review forms and branding
              </p>
            </div>
          </div>

          {/* Custom Messages */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Custom Messages</Label>
            
            <div className="space-y-2">
              <Label htmlFor="welcome_message">Welcome Message</Label>
              <Textarea
                id="welcome_message"
                {...register('welcome_message')}
                placeholder="Welcome message shown to customers"
                rows={2}
                className="mobile-form-input"
              />
              {errors.welcome_message && (
                <p className="text-sm text-destructive">{errors.welcome_message.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thank_you_message">Thank You Message</Label>
              <Textarea
                id="thank_you_message"
                {...register('thank_you_message')}
                placeholder="Message shown after review submission"
                rows={2}
                className="mobile-form-input"
              />
              {errors.thank_you_message && (
                <p className="text-sm text-destructive">{errors.thank_you_message.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 mobile-button"
            >
              {loading || uploading ? 'Saving...' : business ? 'Update Business' : 'Create Business'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading || uploading}
                className="flex-1 mobile-button"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
