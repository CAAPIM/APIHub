// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useEffect } from 'react';
import { useSetLocale, useLocale } from 'react-admin';

import { LocaleSwitcherMenu, supportedLocales, defaultLocale } from './i18n';
import { useApiHubPreference } from './preferences';

export const ApiHubLanguageSwitcher = () => {
    const setLocale = useSetLocale();
    const locale = useLocale();

    const [localePreference, writeLocalePreference] = useApiHubPreference(
        'locale'
    );

    useEffect(() => {
        if (!supportedLocales[localePreference]) {
            writeLocalePreference(defaultLocale);
            return;
        }

        if (localePreference !== locale) {
            setLocale(localePreference);
        }
    }, [locale, localePreference, setLocale, writeLocalePreference]);

    const handleLocaleChange = newLocale => {
        writeLocalePreference(newLocale);
    };

    return (
        <LocaleSwitcherMenu
            locale={locale}
            locales={supportedLocales}
            onChange={handleLocaleChange}
        />
    );
};
