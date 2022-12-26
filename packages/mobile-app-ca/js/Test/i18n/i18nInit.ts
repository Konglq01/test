import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { getData } from '../AsyncStorage/asyncStorageUtil';

import en from './languages/en.json';
import zh from './languages/zh.json';
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = { en, zh };

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3', // Look like an issue on android. Need fallback to v2.
    resources,
    lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

console.log('RNLocalize getLocales', RNLocalize.getLocales());
console.log('RNLocalize getCurrencies', RNLocalize.getCurrencies());

RNLocalize.addEventListener('change', async () => {
  const localLanguage = RNLocalize.getLocales();
  const customLanguageCode = await getData('customLanguageCode');
  if (!customLanguageCode) {
    i18n.changeLanguage(localLanguage[0].languageCode);
  }
});

async function init() {
  const localLanguage = RNLocalize.getLocales();
  const customLanguageCode = await getData('customLanguageCode');
  console.log('customLanguageCode & localLanguageCode: ', customLanguageCode, localLanguage[0].languageCode);
  if (!customLanguageCode && localLanguage) {
    i18n.changeLanguage(localLanguage[0].languageCode);
  }
  if (customLanguageCode) {
    i18n.changeLanguage(customLanguageCode);
  }
}
init();
