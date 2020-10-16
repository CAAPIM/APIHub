import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from './en';
import spanishMessages from './es';
import frenchMessages from './fr';

export const i18nProvider = (defaultLocale = 'en') =>
    polyglotI18nProvider(
        locale => {
            if (locale === 'en') {
                return englishMessages;
            }
            if (locale === 'es') {
                return spanishMessages;
            }
            if (locale === 'fr') {
                return frenchMessages;
            }
        },
        defaultLocale // Default locale
    );
