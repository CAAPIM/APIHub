// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.

// / <reference types="Cypress" />

describe('Reset Password', () => {
    it('should fill the reset password form', () => {
        cy.loadData();

        cy.visit('#/reset-password');

        cy.contains('Reset Password');

        // Fill the username (and trigger validation)

        cy.findByLabelText('Username *')
            .clear()
            .type('Luwangel')
            .blur();

        // Submit

        cy.findByText('Submit').click();

        cy.contains('Reset Password Request Sent');

        // Return to Login Page

        cy.findByText('Go to Sign In').click();

        cy.contains('Sign In To API Hub');
    });
});
