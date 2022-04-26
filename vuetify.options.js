// Translation provided by Vuetify (typescript)
// import ja from 'vuetify/src/locale/ja'

import en from "./lang/en"
import zhHant from "./lang/zhHant"

// Translation provided by Vuetify (typescript)
// import en from 'vuetify/src/locale/en'
// import zhHant from 'vuetify/src/locale/zh-Hant'

export default {
  theme: {
    themes: {
      light: {
        // primary: '#d49063',
        secondary: '#004e82',
        error: '#ff3e30',
        warning: '#f7b529',
        success: '#179c52',
      },
      dark: {
        primary: '#181818',
        secondary: '#222d32',
        // error: '#eee',
        // warning: '#ccc',
        // success: '#bbb',
        // default: '#aaa',
        anchor: '#fff'
      }
    }
  },
  lang: {
    locales: { en, zhHant },
    current: 'en',
  }
}
