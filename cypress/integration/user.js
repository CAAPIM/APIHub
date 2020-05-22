import { login } from '../support/login';
import {
    openUserProfile,
    checkUserProfileDetails,
    checkUserProfileEditDetails,
} from '../support/userProfile';
import { openUserMenu } from '../support/userMenu';

describe('User', () => {
    describe('User Profile', () => {
        before(() => {
            cy.loadData();
        });

        beforeEach(() => {
            login('portalAdmin', 'Password@1');
        });

        it('should display and edit the user profile', () => {
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
    });

    describe('User Organization', () => {
        before(() => {
            cy.loadData();
        });

        beforeEach(() => {
            login('user', 'Password@1');
        });

        it('should swith the organization and stay on the home page', () => {
            cy.visit('/#/');
            openUserMenu();
            cy.findByText('Rau, Walter and McGlynn').click();
            cy.url().should('contains', '/#/');
        });

        it('should swith the organization and stay on the apis page', () => {
            cy.visit('/#/apis');
            openUserMenu();
            cy.findByText('Kertzmann - Abbott').click();
            cy.url().should('contains', '/#/apis');
        });

        it('should swith the organization and stay on the same page', () => {
            cy.visit('/#/applications');
            openUserMenu();
            cy.findByText('Jacobson LLC').click();
            cy.url().should('contains', '/#/applications');
        });
    });
});
