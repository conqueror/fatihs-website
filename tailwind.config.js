/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./src/**/*.svelte"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Define custom colors, fonts, gradients, etc.
      colors: {
        primary: '#1E3A8A', // Example primary color
        'primary-hover': '#1E40AF',
        accent: '#F59E0B'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"Fira Code"', 'Consolas', 'Monaco', 'monospace'],
      },
      // Custom gradients and other design tokens can be added here
    },
  },
  plugins: [],
  // Safelist to preserve Shiki syntax highlighting classes
  safelist: [
    // Core shiki classes
    'shiki',
    'code-block',
    'language-javascript',
    'language-typescript',
    'language-python',
    'language-html',
    'language-css',
    'language-json',
    'language-bash',
    'language-markdown',
    'language-svelte',
    'language-text',
    // Table classes for markdown
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td'
  ]
} 