// / <reference types="Cypress" />

describe('New Password', () => {
    it('should not load the new password form', () => {
        // cy.loadData();

        cy.visit('#/new-password/#token/GildasAndAdrien');

        // Form not loaded

        cy.contains('Cannot create a new password: your token is invalid.');

        // Return to Login Page

        cy.findByText('Go to Sign In').click();

        cy.contains('Sign In To API Hub');
    });

    it('should fill the new password form', () => {
        // cy.loadData();

        cy.visit('#/new-password/#token/Mithrandir');

        cy.contains('Create New Password');

        // Fill the password (and trigger validation)

        cy.findByLabelText('Password *')
            .clear()
            .type('Shadowfax3018')
            .blur();

        cy.contains('At least one special character: !@#$%^&*');

        cy.findByLabelText('Confirm Password *')
            .clear()
            .type('Shadowfax3018!')
            .blur();

        cy.contains('The passwords do not match');

        cy.findByLabelText('Password *').type('!');

        // Submit

        cy.findByText('Change password').click();

        cy.contains(
            'Your password has been reset. Use your new password to log in.'
        );

        // Return to Login Page

        cy.findByText('Go to Sign In').click();

        cy.contains('Sign In To API Hub');
    });

    it('should return an error if the password is the same than before', () => {
        // cy.loadData();

        cy.visit('#/new-password/#token/Saruman'); // Mocks will trigger an error for this token

        cy.contains('Create New Password');

        // Fill the password (and trigger validation)

        cy.findByLabelText('Password *')
            .clear()
            .type('Baggins2890!');

        cy.findByLabelText('Confirm Password *')
            .clear()
            .type('Baggins2890!');

        // Submit

        cy.findByText('Change password').click();

        cy.contains('New password cannot be same as previous passwords.');
    });
});
