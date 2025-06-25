// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { login } from '../support/login';
import {
    openUserProfile,
    checkUserProfileDetails,
    checkUserProfileEditDetails,
} from '../support/userProfile';
import { openUserMenu } from '../support/userMenu';

import defaultData from '../../packages/layer7-apihub-mock/src/defaultData.json';

describe('User', () => {
    before(() => {
        cy.clearLocalStorageCache();
    });

    beforeEach(() => {
        cy.restoreLocalStorageCache();
    });

    afterEach(() => {
        cy.saveLocalStorageCache();
    });

    // User Profile update for admin

    it('should display and edit the user profile', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        openUserProfile();

        // Open the user profile show view

        checkUserProfileDetails({
            username: 'portalAdmin',
            lastName: 'Mertz',
            firstName: 'Porter',
            email: 'Porter.Mertz52@example.com',
        });

        // Open the user profile edit view

        cy.findByText('Edit').click();

        checkUserProfileEditDetails({
            username: 'portalAdmin',
            lastName: 'Mertz',
            firstName: 'Porter',
            email: 'Porter.Mertz52@example.com',
        });

        // Last Name

        cy.findByLabelText('Last Name *')
            .clear()
            .type('Hertz');

        // First Name

        cy.findByLabelText('First Name *')
            .clear()
            .type('Borter');

        cy.findByText('Save').click();

        // Discard notification
        cy.findByText('My Profile').click();
        cy.wait(250);

        // Open the user profile show view
        checkUserProfileDetails({
            username: 'portalAdmin',
            lastName: 'Hertz',
            firstName: 'Borter',
            email: 'Porter.Mertz52@example.com',
        });
    });

    // User profile update for non-admin

    it('Non-admin users cannot update email field', () => {
        cy.loadData();

        login('orgPublisher', 'Password@1');

        openUserProfile();

        // Open the user profile show view

        checkUserProfileDetails({
            username: 'orgPublisher',
            lastName: 'Kulas',
            firstName: 'Darby',
            email: 'Darby.Kulas@example.com',
        });

        // Open the user profile edit view

        cy.findByText('Edit').click();

        checkUserProfileEditDetails({
            username: 'orgPublisher',
            lastName: 'Kulas',
            firstName: 'Darby',
            email: 'Darby.Kulas@example.com',
        });

        // Last Name

        cy.findByLabelText('Last Name *')
            .clear()
            .type('Mertz');

        // First Name

        cy.findByLabelText('First Name *')
            .clear()
            .type('Porter');

        // email field should be in disabled state
        cy.findByLabelText('Email *').should('be.disabled');

        cy.findByText('Save').click();

        // Discard notification
        cy.findByText('My Profile').click();
        cy.wait(250);

        // Open the user profile show view
        checkUserProfileDetails({
            username: 'orgPublisher',
            lastName: 'Mertz',
            firstName: 'Porter',
            email: 'Darby.Kulas@example.com',
        });
    });

    // Updating email-id requires password
    it('should prompt for password on email update', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        openUserProfile();

        // Open the user profile show view

        checkUserProfileDetails({
            username: 'portalAdmin',
            lastName: 'Mertz',
            firstName: 'Porter',
            email: 'Porter.Mertz52@example.com',
        });

        // Open the user profile edit view

        cy.findByText('Edit').click();

        checkUserProfileEditDetails({
            username: 'portalAdmin',
            lastName: 'Mertz',
            firstName: 'Porter',
            email: 'Porter.Mertz52@example.com',
        });

        // Last Name

        cy.findByLabelText('Last Name *')
            .clear()
            .type('Hertz');

        // First Name

        cy.findByLabelText('First Name *')
            .clear()
            .type('Borter');

        // Email

        cy.findByLabelText('Email *')
            .clear()
            .type('Borter.Hertz52@example.com');

        cy.findByText('Save').click();

        cy.findByLabelText('Enter Current Password')
            .clear()
            .type('Password@1');

        cy.findByText('Submit').click();

        // Discard notification
        cy.findByText('My Profile').click();
        cy.wait(250);

        // Open the user profile show view
        checkUserProfileDetails({
            username: 'portalAdmin',
            lastName: 'Hertz',
            firstName: 'Borter',
            email: 'Borter.Hertz52@example.com',
        });
    });

    // Setting new password should prompt for existing password
    // admin user
    it('admin: should prompt for existing password if user is changing password', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        openUserProfile();

        // Open the user profile show view

        checkUserProfileDetails({
            username: 'portalAdmin',
            lastName: 'Mertz',
            firstName: 'Porter',
            email: 'Porter.Mertz52@example.com',
        });

        // Open the user profile edit view

        cy.findByText('Edit').click();

        checkUserProfileEditDetails({
            username: 'portalAdmin',
            lastName: 'Mertz',
            firstName: 'Porter',
            email: 'Porter.Mertz52@example.com',
        });

        // Last Name

        cy.findByLabelText('Last Name *')
            .clear()
            .type('Hertz');

        // First Name

        cy.findByLabelText('First Name *')
            .clear()
            .type('Borter');

        cy.findByText('Update password').click();

        cy.get('[data-testid="new-password"] input')
            .clear()
            .type('Password@1');

        cy.get('[data-testid="confirm-new-password"] input')
            .clear()
            .type('Password@1');

        cy.findByText('Save').click();

        cy.findByLabelText('Enter Current Password')
            .clear()
            .type('Password@1');

        cy.findByText('Submit').click();

        // Discard notification
        cy.findByText('My Profile').click();
        cy.wait(250);

        // Open the user profile show view
        checkUserProfileDetails({
            username: 'portalAdmin',
            lastName: 'Hertz',
            firstName: 'Borter',
            email: 'Porter.Mertz52@example.com',
        });
    });

    // User Organization

    it('should switch the organization and stay on the same page', () => {
        const userData = {
            ...defaultData,
            apis: [],
            applications: [],
            tags: [],
            documents: [],
            assets: [],
            apiGroups: [],
            registrations: [],
            customFields: [],
            apiEulas: [],
        };
        cy.loadData(userData);

        login('user', 'Password@1');

        // Home

        cy.visit('/#/');
        cy.contains('The Home page content has not been provided yet.');
        openUserMenu();
        cy.findByText('Kertzmann - Abbott').click({ force: true });
        cy.contains('Your organization updated successfully');
        cy.url().should('contains', '/#/');
        cy.contains('The Home page content has not been provided yet.').click(); // discard notification

        cy.contains('APIs').click();
        cy.findAllByText('APIs').should('have.length', 3);
        cy.findByText('No results found');
        openUserMenu();
        cy.findByText('Kertzmann - Abbott').click({ force: true });
        cy.contains('Your organization updated successfully');
        cy.url().should('contains', '/#/apis');
        cy.findByText('No results found').click(); // discard notification

        cy.contains('Applications').click();
        cy.findAllByText('Applications').should('have.length', 3);
        cy.findByText('No available applications');
        openUserMenu();
        cy.findByText('Jacobson LLC').click({ force: true });
        cy.contains('Your organization updated successfully');
        cy.url().should('contains', '/#/applications');
    });
});
