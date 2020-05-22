import React from 'react';
import { TestContext, TranslationProvider } from 'react-admin';
import { Typography, Box } from '@material-ui/core';
import { Bathtub } from '@material-ui/icons';
import fetchMock from 'fetch-mock';

import { AccountSetupPage } from './AccountSetup';
import { AccountSetupForm } from './AccountSetupForm';
import { i18nProvider } from '../../i18n';
import { ApiHubProvider } from '../../ApiHubContext';

export default {
    title: 'Authentication/AccountSetup',
    component: AccountSetupPage,
    decorators: [
        storyFn => {
            fetchMock
                .restore()
                .getOnce(
                    'https://apim.dev.ca.com/admin/accountSetup?token=plop',
                    { data: { email: 'test@test.net' } }
                )
                .getOnce(
                    'https://apim.dev.ca.com/api/apim/authenticate/getPublicKey',
                    { data: { email: 'test@test.net' } }
                );

            return storyFn();
        },
    ],
};

const location = { pathname: '/account-setup#token/plop', hash: '#token/plop' };

const CustomHeader = () => (
    <Box display="flex" alignItems="center">
        <Bathtub color="primary" style={{ fontSize: '6rem' }} />
        <Typography variant="h1" color="primary" display="inline">
            My Company
        </Typography>
    </Box>
);

const CustomContent = () => (
    <Typography variant="body1" align="center" style={{ fontSize: '2rem' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis ...
    </Typography>
);

const CustomFooter = () => (
    <Typography
        variant="subtitle1"
        color="textSecondary"
        style={{ fontSize: '0.75rem' }}
    >
        Copyright © 2020 My Company. All Rights Reserved
    </Typography>
);

export const WithCustomComponents = () => (
    <TestContext>
        <TranslationProvider i18nProvider={i18nProvider('en')}>
            <ApiHubProvider url="https://apim.dev.ca.com" tenantName="apim">
                <AccountSetupPage
                    Header={CustomHeader}
                    Content={CustomContent}
                    Footer={CustomFooter}
                    location={location}
                />
            </ApiHubProvider>
        </TranslationProvider>
    </TestContext>
);

export const Form = () => (
    <TestContext>
        <TranslationProvider i18nProvider={i18nProvider('en')}>
            <ApiHubProvider url="https://apim.dev.ca.com" tenantName="apim">
                <AccountSetupForm />
            </ApiHubProvider>
        </TranslationProvider>
    </TestContext>
);
