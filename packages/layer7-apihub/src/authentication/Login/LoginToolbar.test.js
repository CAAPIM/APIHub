import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'react-admin';

import { LoginToolbar } from './LoginToolbar';

describe('LoginToolbar', () => {
    test('should display a loading spinner when loading', () => {
        const { getByRole } = renderWithRedux(<LoginToolbar loading />);

        expect(getByRole('progressbar')).not.toBeNull();
    });

    test('should display an error if error is passed', async () => {
        const { getByText } = renderWithRedux(
            <LoginToolbar error="apihub.login.notifications.invalid_credentials" />
        );

        expect(
            getByText('apihub.login.notifications.invalid_credentials')
        ).not.toBeNull();
    });
});
