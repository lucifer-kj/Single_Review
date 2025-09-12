'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Building2, 
  Edit, 
  Trash2, 
  ExternalLink, 
  QrCode,
  Loader2,
  Star,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { BusinessForm } from '@/components/forms/business-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QRModal } from '@/components/ui/qr-modal';
import { CopyButton } from '@/components/ui/copy-button';
import { SharePanel } from '@/components/ui/share-panel';
import { SharingAnalytics } from '@/components/dashboard/sharing-analytics';

interface Business {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  google_business_url?: string;
  logo_url?: string;
  brand_color: string;
  welcome_message: string;
  thank_you_message: string;
  created_at: string;
  updated_at: string;
  reviews_count?: number;
  average_rating?: number;
}

export function BusinessManagement() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [activeTab, setActiveTab] = useState<'businesses' | 'sharing'>('businesses');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/businesses');
      const data = await response.json();
      
      if (data.success) {
        setBusinesses(data.businesses);
      } else {
        setError(data.error || 'Failed to fetch businesses');
      }
    } catch (err) {
      setError('Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBusiness = async (data: any) => {
    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setShowForm(false);
        fetchBusinesses();
      } else {
        throw new Error(result.error || 'Failed to create business');
      }
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  };

  const handleUpdateBusiness = async (data: any) => {
    if (!editingBusiness) return;
    
    try {
      const response = await fetch(`/api/businesses/${editingBusiness.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEditingBusiness(null);
        fetchBusinesses();
      } else {
        throw new Error(result.error || 'Failed to update business');
      }
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/businesses/${businessId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchBusinesses();
      } else {
        throw new Error(result.error || 'Failed to delete business');
      }
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business');
    }
  };

  const getReviewUrl = (businessId: string) => {
    return `${window.location.origin}/review/${businessId}`;
  };

  const getQRData = (business: Business) => {
    return {
      url: getReviewUrl(business.id),
      businessName: business.name,
      logoUrl: business.logo_url,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchBusinesses} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Businesses</h2>
          <p className="text-muted-foreground">
            Manage your business profiles and review settings
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="mobile-button">
          <Plus className="mr-2 h-4 w-4" />
          Add Business
        </Button>
      </div>

      {/* Businesses Grid */}
      {businesses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Businesses Yet</CardTitle>
            <CardDescription>
              Create your first business profile to start collecting reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Get Started</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your first business to begin collecting customer reviews
                  </p>
                </div>
                <Button onClick={() => setShowForm(true)} className="mobile-button">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Business Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Card key={business.id} className="interactive-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={business.logo_url || undefined} />
                      <AvatarFallback className="bg-muted">
                        <Building2 className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{business.name}</CardTitle>
                      <CardDescription className="truncate">
                        {business.description || 'No description'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    style={{ backgroundColor: business.brand_color + '20', color: business.brand_color }}
                  >
                    Active
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{business.average_rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span>{business.reviews_count || 0} reviews</span>
                  </div>
                </div>

                {/* Review URL */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Review URL
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={getReviewUrl(business.id)}
                      readOnly
                      className="text-xs"
                    />
                    <CopyButton text={getReviewUrl(business.id)} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBusiness(business);
                      setShowQRModal(true);
                    }}
                    className="flex-1"
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingBusiness(business)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBusiness(business.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Links */}
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <Link href={`/review/${business.id}`} target="_blank">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Preview
                    </Link>
                  </Button>
                  {business.google_business_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <Link href={business.google_business_url} target="_blank">
                        <Star className="w-4 h-4 mr-1" />
                        Google
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Business Form Modal */}
      <Dialog open={showForm || !!editingBusiness} onOpenChange={(open) => {
        if (!open) {
          setShowForm(false);
          setEditingBusiness(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBusiness ? 'Edit Business' : 'Create New Business'}
            </DialogTitle>
          </DialogHeader>
          <BusinessForm
            business={editingBusiness || undefined}
            onSubmit={editingBusiness ? handleUpdateBusiness : handleCreateBusiness}
            onCancel={() => {
              setShowForm(false);
              setEditingBusiness(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        data={selectedBusiness ? getQRData(selectedBusiness) : null}
      />
    </div>
  );
}
