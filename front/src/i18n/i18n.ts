import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import {en} from "@/i18n/en.ts"
import {ru} from "@/i18n/ru.ts"

i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
    resources: {
        en: {
            translation: en
        },
        ru: {
            translation: ru
        },
    }
})

export default i18n