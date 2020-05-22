import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'react-admin';

import { LoginPage } from './Login';

describe('Login page', () => {
    test('should display a custom Header if provided', () => {
        const Header = () => <h1>My Header</h1>;

        const { getByText } = renderWithRedux(<LoginPage Header={Header} />);

        expect(getByText('My Header')).not.toBeNull();
    });

    test('should display a custom Footer if provided', () => {
        const Footer = () => <h1>My Footer</h1>;

        const { getByText } = renderWithRedux(<LoginPage Footer={Footer} />);

        expect(getByText('My Footer')).not.toBeNull();
    });

    test('should display a custom Content if provided', () => {
        const Content = () => <h1>My Content</h1>;

        const { getByText } = renderWithRedux(<LoginPage Content={Content} />);

        expect(getByText('My Content')).not.toBeNull();
    });

    test('should display the credentials login form', async () => {
        const { getByLabelText } = renderWithRedux(<LoginPage />);
        expect(getByLabelText('apihub.login.fields.username *')).not.toBeNull();
        expect(getByLabelText('apihub.login.fields.password *')).not.toBeNull();
    });
});
