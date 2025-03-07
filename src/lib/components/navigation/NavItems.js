import SearchIcon from './icons/SearchIcon.svelte';

/**
 * Central configuration for navigation items
 * This makes it easier to maintain consistency across components
 * and simplifies adding or removing navigation items
 */
export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/research', label: 'Research' },
  { href: '/publications', label: 'Publications' },
  { href: '/blog', label: 'Blog' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
  { href: '/search', label: 'Search', icon: SearchIcon }
];

/**
 * Get the placeholder width for each nav item
 * These values match the original widths to prevent layout shifts
 */
export function getPlaceholderWidth(label) {
  switch (label) {
    case 'Home': return '55px';
    case 'About': return '58px';
    case 'Research': return '85px';
    case 'Publications': return '106px';
    case 'Blog': return '48px';
    case 'Events': return '62px';
    case 'Contact': return '76px';
    case 'Search': return '75px';
    default: return 'auto';
  }
} 