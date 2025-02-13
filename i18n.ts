import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './src/locales/en/common.json'

import es from './src/locales/es/common.json'

const enLocale = {
  translation: {
    ...en
  }
}
const esLocale = {
  translation: {
    ...es
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: enLocale,
    es: esLocale
  },
  lng: 'es',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
