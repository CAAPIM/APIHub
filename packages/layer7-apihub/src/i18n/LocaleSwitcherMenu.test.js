// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TestTranslationProvider } from 'ra-core';
import 'jest-localstorage-mock';

import {
    LocaleSwitcherMenu,
    LocaleSwitcherMenuItem,
} from './LocaleSwitcherMenu';
import { supportedLocales } from './supportedLocales';

describe('LocaleSwitcherMenu', () => {
    describe('LocaleSwitcherMenuItem', () => {
        test('should call the onSetLocale handler when clicked', () => {
            const handleSetLocale = jest.fn();
            const { getByText } = render(
                <LocaleSwitcherMenuItem
                    locale="fr"
                    onSetLocale={handleSetLocale}
                >
                    Français
                </LocaleSwitcherMenuItem>
            );

            fireEvent.click(getByText('Français'));
            expect(handleSetLocale).toHaveBeenCalledWith('fr');
        });
    });

    test('should display the current language', () => {
        const { getByText } = render(
            <TestTranslationProvider>
                <LocaleSwitcherMenu locale="en" locales={supportedLocales} />
            </TestTranslationProvider>
        );

        getByText('English');
    });
});
