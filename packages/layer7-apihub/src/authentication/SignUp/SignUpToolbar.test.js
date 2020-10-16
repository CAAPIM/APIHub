import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'react-admin';

import { SignUpToolbar } from './SignUpToolbar';

describe('SignUpToolbar', () => {
    test('should display a loading spinner when loading', () => {
        const { getByRole } = renderWithRedux(<SignUpToolbar loading />);

        expect(getByRole('progressbar')).not.toBeNull();
    });

    test('should display an error if error is passed', async () => {
        const { getByText } = renderWithRedux(
            <SignUpToolbar error="apihub.sign_up.notifications.confirmation_required" />
        );

        expect(
            getByText('apihub.sign_up.notifications.confirmation_required')
        ).not.toBeNull();
    });
});
