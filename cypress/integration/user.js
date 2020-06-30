import { login } from '../support/login';
import {
    openUserProfile,
    checkUserProfileDetails,
    checkUserProfileEditDetails,
} from '../support/userProfile';
import { openUserMenu } from '../support/userMenu';

import userData from '../data/userData.json';

describe('User', () => {
    // User Profile

    it('should display and edit the user profile', () => {
        cy.loadData(userData);

        login('portalAdmin', 'Password@1');

        openUserProfile();

        // Open the user profile show view

        checkUserProfileDetails({
            username: 'portalAdmin',
            lastName: 'Rowe',
            firstName: 'Rosario',
            email: 'Rosario36@example.com',
        });

        // Open the user profile edit view

        cy.findByText('Edit').click();

        checkUserProfileEditDetails({
            username: 'portalAdmin',
            lastName: 'Rowe',
            firstName: 'Rosario',
            email: 'Rosario36@example.com',
        });

        // Last Name

        cy.findByLabelText('Last Name *')
            .clear()
            .type('Rowelo');

        // First Name

        cy.findByLabelText('First Name *')
            .clear()
            .type('Rosarito');

        // Email

        cy.findByLabelText('Email *')
            .clear()
            .type('Rosarito36@marmelab.com');

        cy.findByText('Save').click();

        // Discard notification
        cy.findByText('My Profile').click();
        cy.wait(250);

        // Open the user profile show view
        checkUserProfileDetails({
            username: 'portalAdmin',
            lastName: 'Rowelo',
            firstName: 'Rosarito',
            email: 'Rosarito36@marmelab.com',
        });
    });

    // User Organization

    it('should swith the organization and stay on the same page', () => {
        cy.loadData(userData);

        login('user', 'Password@1');

        // Home

        cy.visit('/#/');
        cy.contains('The Home page content has not been provided yet.');
        openUserMenu();
        cy.findByText('Rau, Walter and McGlynn').click({ force: true });
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
        cy.findByText('No results found');
        openUserMenu();
        cy.findByText('Jacobson LLC').click({ force: true });
        cy.contains('Your organization updated successfully');
        cy.url().should('contains', '/#/applications');
    });
});
