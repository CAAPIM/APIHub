import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'react-admin';

import { SignUpPage, SignUpConfirmation } from './SignUp';

describe('SignUp page', () => {
    test('should display a custom Header if provided', () => {
        const Header = () => <h1>My Header</h1>;

        const { getByText } = renderWithRedux(<SignUpPage Header={Header} />);

        expect(getByText('My Header')).not.toBeNull();
    });

    test('should display a custom Footer if provided', () => {
        const Footer = () => <h1>My Footer</h1>;

        const { getByText } = renderWithRedux(<SignUpPage Footer={Footer} />);

        expect(getByText('My Footer')).not.toBeNull();
    });

    test('should display a custom Content if provided', () => {
        const Content = () => <h1>My Content</h1>;

        const { getByText } = renderWithRedux(<SignUpPage Content={Content} />);

        expect(getByText('My Content')).not.toBeNull();
    });

    test('should display the sign_up form', async () => {
        const { getByLabelText } = renderWithRedux(<SignUpPage />);
        expect(
            getByLabelText('resources.registrations.fields.email *')
        ).not.toBeNull();
        expect(
            getByLabelText(
                'resources.registrations.fields.email_confirmation *'
            )
        ).not.toBeNull();
        expect(
            getByLabelText('resources.registrations.fields.organization')
        ).not.toBeNull();
        expect(
            getByLabelText(
                'resources.registrations.fields.organization_description'
            )
        ).not.toBeNull();
    });
});

describe('SignUpConfirmation', () => {
    it('displays a sign up confirmation message', () => {
        const { getByText } = renderWithRedux(<SignUpConfirmation />);

        expect(getByText('resources.registrations.notifications.confirmation_title')).not.toBeNull();
        expect(getByText('resources.registrations.notifications.confirmation')).not.toBeNull();
        expect(getByText('resources.registrations.actions.return_to_homepage')).not.toBeNull();
    });
});
