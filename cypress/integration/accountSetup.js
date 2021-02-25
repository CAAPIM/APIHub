// / <reference types="Cypress" />

describe('Account Setup', () => {
    it('should not load the account setup form', () => {
        cy.loadData();

        cy.visit('#/account-setup/#token/GildasAndAdrien');

        // Form not loaded

        cy.contains('Your account cannot be set up.');

        // Return to Login Page

        cy.findByText('Go to Sign In').click();

        cy.contains('Sign In To API Hub');
    });

    it('should fill the account setup form', () => {
        cy.loadData();

        cy.visit('#/account-setup/#token/IamLordVoldemort');

        cy.contains('Complete And Activate Account');

        // First part of the form is prefilled

        cy.findByLabelText('First Name *').should($input => {
            const value = $input.val();
            expect(value).to.equal('Tom Marvolo');
        });
        cy.findByLabelText('Last Name *').should($input => {
            const value = $input.val();
            expect(value).to.equal('Riddle');
        });
        cy.findByLabelText('Email *').should($input => {
            const value = $input.val();
            expect(value).to.equal('tom@deathlyhallows.com');
        });

        // Fill the username

        cy.findByLabelText('Username *')
            .clear()
            .type('Voldemort');

        // Fill the password (and trigger validation)

        cy.findByLabelText('Password *')
            .clear()
            .type('ElderWand1926')
            .blur();

        cy.contains('At least one special character: !@#$%^&*');

        cy.findByLabelText('Confirm Password *')
            .clear()
            .type('ElderWand1926!')
            .blur();

        cy.contains('The passwords do not match');

        cy.findByLabelText('Password *').type('!');

        // Fill the terms

        cy.findByLabelText('I have read and accept the Terms of Use').click();

        // Submit

        cy.findByText('Activate Your Account').click();

        cy.contains('Your account has been successfully set up.');

        // Return to Login Page

        cy.findByText('Go to Sign In').click();

        cy.contains('Sign In To API Hub');
    });
});
