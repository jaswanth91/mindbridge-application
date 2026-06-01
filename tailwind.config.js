/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mb: {
          indigo: '#5B6DF6',
          violet: '#7C3AED',
          lavender: '#C4B5FD',
          sky: '#7DD3FC',
          mint: '#6EE7B7',
          blush: '#FBCFE8',
          'soft-bg': '#F3F0FF',
          'dark-bg': '#0F0C2A',
          'dark-text': '#E8E4FF',
          'dark-muted': '#9B96C9',
          'text': '#1E1B4B',
          'muted': '#6B6F9A',
        }
      },
      borderRadius: {
        'mb': '22px',
        'mb-sm': '14px',
      },
      fontFamily: {
        'dm-sans': ['"DM Sans"', 'sans-serif'],
        'dm-serif': ['"DM Serif Display"', 'serif'],
        'tamil': ['"Noto Sans Tamil"', '"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'onboard': 'linear-gradient(160deg, #0F0C2A 0%, #1E1254 40%, #2D1B69 70%, #1a0f4f 100%)',
        'home-dark': 'linear-gradient(170deg, #0F0C2A 0%, #150E3A 50%, #1a1050 100%)',
        'chat': 'linear-gradient(170deg, #0D1B40 0%, #0F1A4A 60%, #0D1635 100%)',
      },
      backdropBlur: {
        'mb': '16px',
      }
    },
  },
  plugins: [],
}
