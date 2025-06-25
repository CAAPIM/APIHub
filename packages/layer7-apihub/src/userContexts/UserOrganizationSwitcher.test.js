// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState } from 'react';
import expect from 'expect';
import { I18nContextProvider } from 'react-admin';
import { render, waitFor, fireEvent, within } from '@testing-library/react';

import { UserOrganizationSwitcher } from './UserOrganizationSwitcher';
import { i18nProvider } from '../i18n';

describe('UserOrganizationSwitcher page', () => {
    const TestUserOrganizationSwitcher = () => {
        const [userContext, setUserContext] = useState({
            activeOrgUuid: 'covfefe-fr51',
            accessibleOrgs: {
                'Portal Covfefe': 'covfefe-fr51',
                Chell: 'GLaDOS-17',
            },
        });

        const handleChangeUserContext = () => {
            const newUserContext = {
                ...userContext,
                activeOrgUuid:
                    userContext.activeOrgUuid === 'covfefe-fr51'
                        ? 'GLaDOS-17'
                        : 'covfefe-fr51',
            };
            setUserContext(newUserContext);
        };

        return (
            <I18nContextProvider value={i18nProvider('en')}>
                <UserOrganizationSwitcher
                    userContext={userContext}
                    onChangeUserContext={handleChangeUserContext}
                />
            </I18nContextProvider>
        );
    };

    test('should display the list of organizations', async () => {
        const { getByText } = render(<TestUserOrganizationSwitcher />);

        expect(getByText('My Organizations')).not.toBeNull();
        expect(getByText('Portal Covfefe')).not.toBeNull();
        expect(getByText('Chell')).not.toBeNull();
    });

    test('should select the current organization', async () => {
        const { getByLabelText } = render(<TestUserOrganizationSwitcher />);

        const selectedOrganization = getByLabelText('Selected organization');
        expect(selectedOrganization).not.toBeNull();
        expect(
            within(selectedOrganization).getByText('Portal Covfefe')
        ).not.toBeNull();
    });

    test('should change the current organization', async () => {
        const { getByLabelText } = render(<TestUserOrganizationSwitcher />);

        const notSelectedOrganization = within(
            getByLabelText('Organization not selected')
        ).getByText('Chell');

        fireEvent.click(notSelectedOrganization);

        await waitFor(() => {
            const newSelectedOrganization = getByLabelText(
                'Selected organization'
            );

            expect(newSelectedOrganization).not.toBeNull();
            expect(
                within(newSelectedOrganization).getByText('Chell')
            ).not.toBeNull();
        });
    });
});
