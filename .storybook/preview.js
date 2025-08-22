import '../src/style.css'
import { setup } from '@storybook/vue3'
import { createPinia } from 'pinia'

// Configurar Pinia para los stores
const pinia = createPinia()
setup((app) => {
  app.use(pinia)
})

/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff'
        },
        {
          name: 'dark',
          value: '#1f2937'
        },
        {
          name: 'gray',
          value: '#f3f4f6'
        }
      ]
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px'
          }
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px'
          }
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1024px',
            height: '768px'
          }
        },
        wide: {
          name: 'Wide',
          styles: {
            width: '1440px',
            height: '900px'
          }
        }
      }
    },
    docs: {
      toc: true,
      source: {
        state: 'open'
      }
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true
          }
        ]
      }
    }
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true
      }
    },
    locale: {
      description: 'Internationalization locale',
      defaultValue: 'es',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'es', right: '🇪🇸', title: 'Español' },
          { value: 'en', right: '🇺🇸', title: 'English' }
        ]
      }
    }
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme
      return {
        template: `
          <div :class="themeClass" class="p-4 min-h-screen">
            <story />
          </div>
        `,
        computed: {
          themeClass() {
            return theme === 'dark' ? 'dark bg-gray-900' : 'bg-white'
          }
        }
      }
    }
  ]
}

export default preview