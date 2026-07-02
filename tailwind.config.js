/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#090909',
        foreground: '#f5f5f5',
        card: '#0f0f0f',
        'card-foreground': '#f5f5f5',
        primary: '#D4AF37',
        'primary-foreground': '#090909',
        secondary: '#1a1a1a',
        'secondary-foreground': '#f5f5f5',
        muted: '#1a1a1a',
        'muted-foreground': '#737373',
        accent: '#D4AF37',
        'accent-foreground': '#090909',
        destructive: '#FF3D3D',
        'destructive-foreground': '#fafafa',
        border: '#262626',
        input: '#262626',
        ring: '#D4AF37',
        gold: { DEFAULT: '#D4AF37', light: '#F5D76E', dark: '#A08020' },
        emerald: '#00C853',
        danger: '#FF3D3D',
        warn: '#FFC107',
      },
      fontFamily: {
        heading: ['Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: 'calc(0.75rem - 2px)',
        sm: 'calc(0.75rem - 4px)',
      },
    },
  },
  plugins: [],
}
