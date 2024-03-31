/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,js}"],
  // darkMode: ['class', '[data-mode="dark"]'],
  darkMode: 'class',
  theme: {
    extend: {
      width: {
        'full-width-over': 'calc(100% + 40px)'
      },
      colors: {
        'win': '#739cf5',
        'dark-win': '#28344E',
        'lose': '#cc6e7f',
        'dark-lose': '#59343B',
        'details-blue': '#668de3',
        'dark-details-blue': '#2F436E',
        'details-red': '#b56072',
        'dark-details-red': '#703C47',
        'kda-3over': '#00BBA3',
        'kda-4over': '#0093FF',
        'kda-5over': '#FF8200'

      },
      screens: { 
        "mobile": '320px',
        "mobile_big": '400px',
        "tablet": '600px',
        "tablet_big": '686px',
        // laptop: '1200px',
        // desktop: '1536px',
        // "pointerhover": {
        //   'raw': '(hover: hover) and (pointer: fine)',
        // },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('tailwind-scrollbar')({ preferredStrategy: 'pseudoelements' }),

  ],
}

