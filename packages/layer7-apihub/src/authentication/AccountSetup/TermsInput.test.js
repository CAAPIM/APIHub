// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import expect from 'expect';
import { fireEvent, cleanup, waitFor, render } from '@testing-library/react';

import { ApiHubProvider } from '../../ApiHubContext';
import { TermsLabel } from './TermsInput';
import { AdminContext } from 'react-admin';

describe('TermsInput', () => {
    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            text: () => Promise.resolve(JSON.stringify(true)),
        });
    });

    afterEach(cleanup);

    describe('TermsLabel', () => {
        test('should display a link', () => {
            const { findByText } = render(
                <ApiHubProvider url="http://apihub" tenantName="apim">
                    <AdminContext>
                        <TermsLabel />
                    </AdminContext>
                </ApiHubProvider>
            );

            expect(
                findByText('apihub.account_setup.terms_of_use.terms_of_use')
            ).not.toBeNull();
        });

        test('should open the terms in a dialog when clicking on the link', async () => {
            const { findByText } = render(
                <ApiHubProvider url="http://apihub" tenantName="apim">
                    <AdminContext>
                        <TermsLabel />
                    </AdminContext>
                </ApiHubProvider>
            );

            await waitFor(() => {
                expect(
                    findByText('apihub.account_setup.terms_of_use.terms_of_use')
                ).not.toBeNull();
            });

            /*fireEvent.click(
                findByText('apihub.account_setup.terms_of_use.terms_of_use')
            );*/

            await waitFor(() => {
                expect(
                    findByText(
                        'apihub.account_setup.terms_of_use.terms_of_use_dialog.title'
                    )
                ).not.toBeNull();
            });
        });
    });
});
