/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./src/**/*.svelte"
  ],
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
      },
      // Custom gradients and other design tokens can be added here
    },
  },
  plugins: [],
  // Ensure Tailwind doesn't purge Prism.js classes
  safelist: [
    { pattern: /language-\w+/ },
    { pattern: /token/ },
    { pattern: /pre/ },
    { pattern: /code/ }
  ]
} 