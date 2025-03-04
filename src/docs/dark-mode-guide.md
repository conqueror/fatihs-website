# Dark Mode Styling Guide

This guide provides best practices for maintaining consistent light and dark mode styling across the website. Following these guidelines will help ensure a consistent and accessible user experience regardless of theme preference.

## Core Principles

1. **Use Tailwind's dark mode classes** - Tailwind CSS supports dark mode out of the box with the `dark:` prefix
2. **Maintain appropriate contrast** - Ensure text and UI elements have sufficient contrast in both modes
3. **Be consistent with color usage** - Use consistent color patterns for similar elements
4. **Test both modes** - Always test changes in both light and dark modes

## Dark Mode Setup

The website uses a class-based dark mode approach, defined in `tailwind.config.js`:

```js
module.exports = {
  darkMode: 'class',
  // rest of config
}
```

The theme toggle functionality is implemented in `src/lib/ThemeToggle.svelte` which adds/removes the `dark` class from the `html` element.

## Color Strategy

### Text Colors

For consistent text styling, follow these patterns:

| Element Type | Light Mode | Dark Mode |
|--------------|------------|-----------|
| Headings | `text-gray-800` | `dark:text-gray-100` |
| Body text | `text-gray-600` | `dark:text-gray-300` |
| Secondary text | `text-gray-500` | `dark:text-gray-400` |
| Links (primary) | `text-primary` | `dark:text-blue-400` |
| Links (secondary) | `text-indigo-600` | `dark:text-indigo-400` |

### Background Colors

| Element Type | Light Mode | Dark Mode |
|--------------|------------|-----------|
| Main background | `bg-white` | `dark:bg-gray-900` |
| Card background | `bg-white` | `dark:bg-gray-800` |
| Secondary background | `bg-gray-50` | `dark:bg-gray-800` |
| Accent backgrounds | `bg-{color}-100` | `dark:bg-{color}-900/30` |

### Borders

| Element Type | Light Mode | Dark Mode |
|--------------|------------|-----------|
| Card borders | `border-gray-100` | `dark:border-gray-700` |
| Dividers | `border-gray-200` | `dark:border-gray-700` |
| Accent borders | `border-{color}-400` | `dark:border-{color}-500` |

## Component Patterns

### Cards

```html
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
    <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Card Title</h3>
    <p class="text-gray-600 dark:text-gray-300">Card content</p>
</div>
```

### Buttons

Primary button:
```html
<button class="bg-primary text-white hover:bg-primary-dark">Button Text</button>
```

Secondary button:
```html
<button class="bg-white dark:bg-gray-800 text-primary dark:text-blue-400 border border-primary dark:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700">Button Text</button>
```

### Tags/Badges

```html
<span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm rounded-full">Tag</span>
```

## Gradients and Decorative Elements

When using gradients, ensure they work well in both light and dark modes:

```html
<!-- Background gradient -->
<div class="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"></div>

<!-- Decorative element -->
<div class="bg-primary/10 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
```

## SVG Icons

When using SVG icons, adjust their colors for dark mode:

```html
<svg class="text-primary dark:text-blue-400" viewBox="0 0 24 24">
  <!-- icon paths -->
</svg>
```

## Best Practices for Adding New Components

1. **Start with light mode** designs, then add dark mode styles
2. **Use Tailwind's dark variant** (`dark:`) rather than custom CSS
3. **Check contrast ratios** to ensure accessibility (minimum 4.5:1 for normal text)
4. **Test interactivity** in both modes (hover, focus, active states)
5. **Be mindful of shadows** - reduce opacity or adjust colors in dark mode
6. **Test in real browsers** not just previews

## Debugging Dark Mode Issues

If you encounter dark mode styling issues:

1. Inspect the element using browser dev tools
2. Check if the `dark` class is present on the `html` element
3. Verify your dark mode styles are being applied (they may be overridden)
4. Test specific components in isolation
5. Check for hardcoded colors that don't adapt to the theme

## Adding New Color Schemes

If you need to extend the color palette:

1. Add new colors to the `tailwind.config.js` file
2. Follow the existing pattern of providing both light and dark variants
3. Document the new colors in this guide
4. Update component examples to show usage

## Accessibility Reminders

- Maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text
- Don't rely on color alone to convey information
- Test with screen readers in both light and dark modes
- Ensure focus states are visible in both modes

By following these guidelines, you'll help maintain a consistent, accessible, and visually appealing experience across both light and dark modes of the website. 