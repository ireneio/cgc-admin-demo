export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'CGC | Admincenter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'CGC Admincenter' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/scss/main.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    // '~/plugins/vee-validate.js',
    '~/plugins/axios'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    [
      '@nuxtjs/vuetify',
      {
        /* module options */
      }
    ]
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    babel: {
      presets() {
        return [['@nuxt/babel-preset-app', { loose: true }]]
      }
    },
    extend() {

    },
    uglify: {
      uglifyOptions: {
        compress: {
          drop_console: true
        }
      }
    },
    extractCSS: true,
    transpile: ['vee-validate/dist/rules'],
    // analyze: process.env.NODE_ENV !== 'production'
    analyze: false
  },
  env: {
    API_USER_URL: process.env.NUXT_ENV_API_USER_URL || 'https://api-dev.catheon.cloud/admincenter/v1',
    API_PLATFORM_URL: process.env.NUXT_ENV_API_PLATFORM_URL || 'https://service-user-lsbcp.ondigitalocean.app/platform',
    FB_APIKEY: process.env.NUXT_ENV_FB_APIKEY || 'AIzaSyBnB4nY6EjwtRClA7J75Ztz4bMUOEumrV0',
    FB_AUTHDOMAIN: process.env.NUXT_ENV_FB_AUTHDOMAIN || 'dfon-web.firebaseapp.com',
    FB_DBURL: process.env.NUXT_ENV_FB_DBURL || '',
    FB_PROJECTID: process.env.NUXT_ENV_FB_PROJECTID || 'dfon-web',
    FB_APPID: process.env.NUXT_ENV_FB_APPID || '1:844281271792:web:fb1cde23ccf78faac07935'
  },
  loading: '~/components/DefaultLoading.vue',
  vuetify: {
    optionsPath: './vuetify.options.js'
  },
  server: {
    port: 3002,
    host: '0.0.0.0'
  }
}
