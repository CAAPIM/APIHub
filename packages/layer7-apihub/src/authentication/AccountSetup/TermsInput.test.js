import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'react-admin';
import { fireEvent, cleanup, wait } from '@testing-library/react';

import { ApiHubProvider } from '../../ApiHubContext';
import { TermsLabel } from './TermsInput';

describe('TermsInput', () => {
    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: () => Promise.resolve(true),
        });
    });

    afterEach(cleanup);

    describe('TermsLabel', () => {
        test('should display a link', () => {
            const { getByText } = renderWithRedux(
                <ApiHubProvider url="/api" tenantName="api">
                    <TermsLabel />
                </ApiHubProvider>
            );

            expect(
                getByText('apihub.account_setup.terms_of_use')
            ).not.toBeNull();
        });

        test('should open the terms in a dialog when clicking on the link', async () => {
            const { getByText } = renderWithRedux(
                <ApiHubProvider url="/api" tenantName="api">
                    <TermsLabel />
                </ApiHubProvider>
            );

            await wait(() => {
                expect(
                    getByText('apihub.account_setup.terms_of_use')
                ).not.toBeNull();
            });

            fireEvent.click(getByText('apihub.account_setup.terms_of_use'));

            await wait(() => {
                expect(
                    getByText('apihub.account_setup.terms_of_use_dialog.title')
                ).not.toBeNull();
            });
        });
    });
});
