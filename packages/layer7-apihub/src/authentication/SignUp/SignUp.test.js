// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';

import { SignUpPage, SignUpConfirmation } from './SignUp';

describe('SignUp page', () => {
    test.skip('should display a custom Header if provided', () => {
        const Header = () => <h1>My Header</h1>;

        const { findByText } = render(<SignUpPage Header={Header} />);

        expect(findByText('My Header')).not.toBeNull();
    });

    test.skip('should display a custom Footer if provided', () => {
        const Footer = () => <h1>My Footer</h1>;

        const { findByText } = render(<SignUpPage Footer={Footer} />);

        expect(findByText('My Footer')).not.toBeNull();
    });

    test.skip('should display a custom Content if provided', () => {
        const Content = () => <h1>My Content</h1>;

        const { findByText } = render(<SignUpPage Content={Content} />);

        expect(findByText('My Content')).not.toBeNull();
    });

    test.skip('should display the sign_up form', async () => {
        const { findByText } = render(<SignUpPage />);
        expect(
            findByText('resources.registrations.fields.email *')
        ).not.toBeNull();
        expect(
            findByText('resources.registrations.fields.email_confirmation *')
        ).not.toBeNull();
        expect(
            findByText('resources.registrations.fields.organization')
        ).not.toBeNull();
        expect(
            findByText(
                'resources.registrations.fields.organization_description'
            )
        ).not.toBeNull();
    });
});

describe('SignUpConfirmation', () => {
    it.skip('displays a sign up confirmation message', () => {
        const { getByText } = render(<SignUpConfirmation />);

        expect(
            getByText(
                'resources.registrations.notifications.confirmation_title'
            )
        ).not.toBeNull();
        expect(
            getByText('resources.registrations.notifications.confirmation')
        ).not.toBeNull();
        expect(
            getByText('resources.registrations.actions.return_to_homepage')
        ).not.toBeNull();
    });
});
