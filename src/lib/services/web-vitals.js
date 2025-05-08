/**
 * Web Vitals Tracking for Performance Monitoring
 * 
 * This module tracks Core Web Vitals metrics and sends them to analytics.
 * It handles LCP, FID, CLS, TTFB, and FCP metrics.
 */

import { onCLS, onFID, onLCP, onTTFB, onFCP } from 'web-vitals';
import { browser } from '$app/environment';
import { trackEvent } from './analytics';

// The main function to initialize Web Vitals tracking
export function initWebVitals() {
  if (!browser) return;
  
  // Log the metrics to the console in development
  const isDev = import.meta.env.DEV;
  
  // Track Largest Contentful Paint (LCP)
  onLCP(metric => {
    const value = Math.round(metric.value);
    const rating = getRating('LCP', value);
    
    if (isDev) {
      console.log(`LCP: ${value}ms (${rating})`);
    }
    
    sendToAnalytics('LCP', metric);
  });
  
  // Track First Input Delay (FID)
  onFID(metric => {
    const value = Math.round(metric.value);
    const rating = getRating('FID', value);
    
    if (isDev) {
      console.log(`FID: ${value}ms (${rating})`);
    }
    
    sendToAnalytics('FID', metric);
  });
  
  // Track Cumulative Layout Shift (CLS)
  onCLS(metric => {
    // CLS is a unitless value, rounded to 2 decimal places
    const value = Math.round(metric.value * 100) / 100;
    const rating = getRating('CLS', value);
    
    if (isDev) {
      console.log(`CLS: ${value} (${rating})`);
    }
    
    sendToAnalytics('CLS', metric);
  });
  
  // Track Time to First Byte (TTFB)
  onTTFB(metric => {
    const value = Math.round(metric.value);
    const rating = getRating('TTFB', value);
    
    if (isDev) {
      console.log(`TTFB: ${value}ms (${rating})`);
    }
    
    sendToAnalytics('TTFB', metric);
  });
  
  // Track First Contentful Paint (FCP)
  onFCP(metric => {
    const value = Math.round(metric.value);
    const rating = getRating('FCP', value);
    
    if (isDev) {
      console.log(`FCP: ${value}ms (${rating})`);
    }
    
    sendToAnalytics('FCP', metric);
  });
}

// Helper function to determine performance rating
function getRating(metric, value) {
  switch (metric) {
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    default:
      return 'unknown';
  }
}

// Send metrics to analytics
function sendToAnalytics(name, metric) {
  // Using the trackEvent function from analytics.js
  trackEvent('Web Vitals', name, metric.rating || getRating(name, metric.value), Math.round(metric.value));
  
  // You can also send detailed metrics
  trackEvent('Web Vitals Detail', `${name} Details`, JSON.stringify({
    value: metric.value,
    rating: metric.rating || getRating(name, metric.value),
    id: metric.id,
    navigationType: metric.navigationType || 'unknown'
  }));
} 