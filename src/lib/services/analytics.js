import { browser } from '$app/environment';
import { page } from '$app/stores';
import { cookieConsent } from '$lib/components/CookieConsent.svelte';
import { derived, get } from 'svelte/store';

// Only enable analytics when consent is given
export const analyticsEnabled = derived(
  cookieConsent,
  ($cookieConsent) => $cookieConsent.analytics
);

// Store whether analytics has been initialized
let initialized = false;

// Initialize analytics based on user consent
export function initAnalytics() {
  if (!browser) return;
  
  analyticsEnabled.subscribe(enabled => {
    if (enabled && !initialized) {
      // Load Google Analytics script dynamically
      console.log('Loading analytics with privacy settings...');
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YOURTRACKINID';
      script.async = true;
      document.head.appendChild(script);
      
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        dataLayer.push(arguments);
      };
      
      gtag('js', new Date());
      
      // Configure with privacy settings
      gtag('config', 'G-YOURTRACKINID', {
        'anonymize_ip': true,                   // Anonymize IP addresses
        'allow_google_signals': false,          // Disable Google signals
        'allow_ad_personalization_signals': false,  // Disable ad personalization
        'cookie_expires': 60 * 60 * 24 * 90,    // Set cookies to expire in 90 days
        'cookie_domain': 'auto',
        'page_title': document.title
      });
      
      initialized = true;
    } else if (!enabled && initialized) {
      // If user revokes consent, remove Google Analytics
      console.log('Removing analytics due to consent withdrawal...');
      const nodes = document.querySelectorAll('script[src*="googletagmanager.com"]');
      nodes.forEach(node => node.parentNode.removeChild(node));
      
      // Remove cookies
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Find and remove Google Analytics cookies (_ga, _gid, etc.)
        if (cookie.indexOf('_g') === 0) {
          const cookieName = cookie.substring(0, cookie.indexOf('='));
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      }
      
      // Reset Google Analytics variables
      window.dataLayer = undefined;
      window.gtag = undefined;
      initialized = false;
    }
  });
}

// Track page views
export function trackPageView(path = null) {
  if (!browser || !get(analyticsEnabled) || !window.gtag) return;
  
  const url = path || get(page)?.url?.pathname + get(page)?.url?.search;
  
  console.log('Tracking page view:', url);
  gtag('event', 'page_view', {
    page_path: url,
    page_title: document.title
  });
}

// Track custom events
export function trackEvent(category, action, label = null, value = null) {
  if (!browser || !get(analyticsEnabled) || !window.gtag) return;
  
  console.log(`Tracking event: ${category} / ${action}`);
  const eventParams = {
    'event_category': category
  };
  
  if (label) eventParams.event_label = label;
  if (value) eventParams.value = value;
  
  gtag('event', action, eventParams);
}

// Function to determine if Do Not Track is enabled
export function isDoNotTrackEnabled() {
  if (!browser) return false;
  
  return (
    navigator.doNotTrack === '1' || 
    navigator.doNotTrack === 'yes' ||
    window.doNotTrack === '1'
  );
} 