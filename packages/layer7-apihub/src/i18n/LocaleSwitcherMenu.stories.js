import React, { useState } from 'react';
import { TestContext, TranslationProvider } from 'react-admin';

import { i18nProvider } from '../i18n';
import { LocaleSwitcherMenu } from './LocaleSwitcherMenu';
import { ApiHubAppBar } from '../ApiHubAppBar';
import { ApiHubProvider } from '../ApiHubContext';

export default {
    title: 'Internationalization/LocaleSwitcherMenu',
    component: LocaleSwitcherMenu,
};

export const Default = () => {
    const [locale, setLocale] = useState('fr');
    const locales = { fr: 'Français', en: 'English' };

    return (
        <TestContext>
            <ApiHubProvider url="https://apim.dev.ca.com">
                <LocaleSwitcherMenu
                    onChange={setLocale}
                    locale={locale}
                    locales={locales}
                />
            </ApiHubProvider>
        </TestContext>
    );
};

export const InAppBar = () => (
    <TestContext>
        <TranslationProvider i18nProvider={i18nProvider('en')}>
            <ApiHubProvider url="https://apim.dev.ca.com">
                <ApiHubAppBar />
            </ApiHubProvider>
        </TranslationProvider>
    </TestContext>
);
