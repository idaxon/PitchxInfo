/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#F8F7F3',
        foreground: '#1A1A19',
        border: '#E4E2DA',
        'border-strong': '#CBC8BD',
        card: '#FFFFFF',
        accent: {
          DEFAULT: '#F9BE08',
          hover: '#E5AC04',
          subtle: '#FFF8E1',
          border: '#E0AA06',
        },
        dark: {
          bg: '#1A1A19',
          surface: '#242422',
          border: '#333330',
          text: '#F8F7F3',
          muted: '#9E9D95',
        },
        muted: {
          DEFAULT: '#6B6A65',
          light: '#8F8E87',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Instrument Serif', 'Georgia', 'serif'],
        sans: ['Geist', 'Satoshi', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        hand: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'evidence': '0 1px 3px rgba(26,26,25,0.04), 0 4px 12px rgba(26,26,25,0.06)',
        'evidence-lift': '0 8px 30px rgba(26,26,25,0.12), 0 2px 6px rgba(26,26,25,0.06)',
        'seal': '0 0 40px rgba(249,190,8,0.22), 0 10px 25px rgba(26,26,25,0.15)',
        'stamp': 'inset 0 0 0 1px rgba(249,190,8,0.3)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        stampIn: {
          '0%': { transform: 'scale(1.3) rotate(-6deg)', opacity: '0' },
          '80%': { transform: 'scale(0.97) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        }
      },
      animation: {
        'marquee': 'marquee 28s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'stamp': 'stampIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      }
    },
  },
  plugins: [],
}
