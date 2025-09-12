'use client';

import { useEffect } from 'react';

interface LinkTrackerProps {
  businessId: string;
  linkType: 'qr_code' | 'direct_link' | 'social_share' | 'email' | 'sms';
  source?: string;
}

export function LinkTracker({ businessId, linkType, source }: LinkTrackerProps) {
  useEffect(() => {
    const trackLinkClick = async () => {
      try {
        await fetch('/api/analytics/link-tracking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            business_id: businessId,
            link_type: linkType,
            source: source || 'unknown',
            user_agent: navigator.userAgent,
            referrer: document.referrer,
          }),
        });
      } catch (error) {
        console.error('Failed to track link click:', error);
      }
    };

    trackLinkClick();
  }, [businessId, linkType, source]);

  return null; // This component doesn't render anything
}
