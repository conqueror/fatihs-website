import SearchIcon from './icons/SearchIcon.svelte';

/**
 * Central configuration for navigation items
 * This makes it easier to maintain consistency across components
 * and simplifies adding or removing navigation items
 */
export const navItems = [
  { href: '/', label: 'Home', iconName: 'home' },
  { href: '/about', label: 'About', iconName: 'about' },
  { href: '/research', label: 'Research', iconName: 'research' },
  { href: '/publications', label: 'Publications', iconName: 'publications' },
  { href: '/blog', label: 'Blog', iconName: 'blog' },
  { href: '/events', label: 'Events', iconName: 'events' },
  { href: '/contact', label: 'Contact', iconName: 'contact' },
  { href: '/search', label: 'Search', icon: SearchIcon, iconName: 'search' }
];

/**
 * Get the placeholder width for each nav item
 * These values match the original widths to prevent layout shifts
 */
export function getPlaceholderWidth(label) {
  switch (label) {
    case 'Home': return '75px';
    case 'About': return '78px';
    case 'Research': return '105px';
    case 'Publications': return '126px';
    case 'Blog': return '68px';
    case 'Events': return '82px';
    case 'Contact': return '96px';
    case 'Search': return '75px';
    default: return 'auto';
  }
} 