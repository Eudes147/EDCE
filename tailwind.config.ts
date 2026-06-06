import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app/components/**/*.{js,ts,tsx,jsx,vue}",
    "./app/layouts/**/*.{js,ts,tsx,jsx,vue}",
    "./app/pages/**/*.{js,ts,tsx,jsx,vue}",
    "./app/plugins/**/*.{js,ts,tsx,jsx,vue}",
    "./app/app.vue"  
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs EDCE
        'surface': '#faf8ff',
        'surface-dim': '#d9d9e4',
        'surface-bright': '#faf8ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f2fe',
        'surface-container': '#ededf8',
        'surface-container-high': '#e8e7f3',
        'surface-container-highest': '#e2e1ed',
        'on-surface': '#1a1b23',
        'on-surface-variant': '#434655',
        'inverse-surface': '#2e3039',
        'inverse-on-surface': '#f0f0fb',
        'outline': '#747686',
        'outline-variant': '#c4c5d7',
        'surface-tint': '#1f51da',
        'primary': '#0041c6',
        'on-primary': '#ffffff',
        'primary-container': '#2d5be3',
        'on-primary-container': '#e2e5ff',
        'inverse-primary': '#b6c4ff',
        'secondary': '#855300',
        'on-secondary': '#ffffff',
        'secondary-container': '#fea619',
        'on-secondary-container': '#684000',
        'tertiary': '#8c3200',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#b44200',
        'on-tertiary-container': '#ffe0d5',
        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'primary-fixed': '#dce1ff',
        'primary-fixed-dim': '#b6c4ff',
        'on-primary-fixed': '#001550',
        'on-primary-fixed-variant': '#003ab3',
        'secondary-fixed': '#ffddb8',
        'secondary-fixed-dim': '#ffb95f',
        'on-secondary-fixed': '#2a1700',
        'on-secondary-fixed-variant': '#653e00',
        'tertiary-fixed': '#ffdbce',
        'tertiary-fixed-dim': '#ffb598',
        'on-tertiary-fixed': '#370f00',
        'on-tertiary-fixed-variant': '#7e2c00',
        'background': '#faf8ff',
        'on-background': '#1a1b23',
        'surface-variant': '#e2e1ed',
      },

      
      backgroundImage: {
        'badge-actif':   'linear-gradient(180deg, #31C552 0%, #185F28 100%)',
        'badge-inactif': 'linear-gradient(180deg, #E23100 0%, #7C1B00 100%)',
        'badge-default':'linear-gradient(270deg, #E05A00 0%, #7A3100 100%)'
      },

      fontFamily: {
        sans:  ['Outfit', 'Sora', 'system-ui', 'sans-serif'],
        "body-lg": ["Sora"],
        "h3": ["Outfit"],
                        "label-md": ["Sora"],
                        "h1": ["Outfit"],
                        "label-sm": ["Sora"],
                        "h1-mobile": ["Outfit"],
                        "body-sm": ["Sora"],
                        "body-md": ["Sora"],
                        "h2": ["Outfit"],
                        "caption": ["Sora"],
                        "small": ["Sora"]
      },

      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px', 
      },
      spacing: {
        'base': '.5rem',
        'xs': '.25rem',
        'sm': '.75rem',
        'md': '1.5rem',
        'lg': '2.5rem',
        'xl': '4rem',
        'gutter': '1.5rem',
        'margin-mobile': '1rem',
        'margin-desktop': '3rem',
        "topbar_height": "56px",
        "sidebar_width": "240px",
        "container_padding": "2rem"
      },

      boxShadow: {
        'soft':   '0 2px 8px -2px rgba(15, 23, 42, 0.08)',
        'medium': '0 4px 16px -4px rgba(15, 23, 42, 0.12)',
        'strong': '0 8px 24px -8px rgba(15, 23, 42, 0.16)',
      },
      
      fontSize: {
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                  
                        "label-md": ["14px", {"lineHeight": "16px", "fontWeight": "600"}],
                    
                        "label-sm": ["12px", {"lineHeight": "14px", "fontWeight": "500"}],
                        "h1-mobile": ["32px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],

                        "h1": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                        "body": ["14px", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "h2": ["24px", {"lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                        "h3": ["18px", {"lineHeight": "1.4", "fontWeight": "500"}],
                        "caption": ["11px", {"lineHeight": "1.4", "letterSpacing": "0.02em", "fontWeight": "500"}],
                        "small": ["12px", {"lineHeight": "1.5", "fontWeight": "400"}]
      }
    },
  },
}