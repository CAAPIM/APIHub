import React from 'react';
import { TestContext, TranslationProvider } from 'react-admin';
import { withKnobs, object } from '@storybook/addon-knobs';

import { i18nProvider } from '../i18n';
import { TagsField } from './TagsField';

export default {
    title: 'Apis/TagsField',
    component: TagsField,
    decorators: [withKnobs],
};

export const Default = () => (
    <TestContext>
        <TranslationProvider i18nProvider={i18nProvider('en')}>
            <TagsField
                record={object('record', { tags: ['test', 'another'] })}
                source="tags"
            />
        </TranslationProvider>
    </TestContext>
);

export const TooManyTags = () => (
    <TestContext>
        <TranslationProvider i18nProvider={i18nProvider('en')}>
            <TagsField
                record={object('record', {
                    tags: ['test', 'another', 'yet another very long tag'],
                })}
                source="tags"
            />
        </TranslationProvider>
    </TestContext>
);
