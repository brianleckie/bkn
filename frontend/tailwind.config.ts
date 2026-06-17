import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bkn: {
          base:      '#0A0A0A',
          panel:     '#111111',
          raised:    '#1A1A1A',
          input:     '#0E0E0E',
          gold:      '#B8996A',
          'gold-h':  '#cdab7c',
          'gold-alt':'#C9A86F',
          text:      '#F0EDE8',
          silver:    '#C8C8C8',
          mono:      '#666666',
          wa:        '#25D366',
          danger:    '#d4685f',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
        sans:    ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
