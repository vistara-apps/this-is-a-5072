/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210, 25%, 95%)',
        accent: 'hsl(130, 70%, 50%)',
        primary: 'hsl(210, 70%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
        destructive: 'hsl(0, 70%, 50%)',
        textPrimary: 'hsl(210, 25%, 15%)',
        textSecondary: 'hsl(210, 25%, 35%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
        'xl': '24px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 25%, 15%, 0.08)',
        'modal': '0 16px 48px hsla(210, 25%, 15%, 0.16)',
      },
    },
  },
  plugins: [],
}