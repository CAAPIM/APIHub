import { openUserMenu } from './userMenu';

export const openUserProfile = () => {
    openUserMenu();
    cy.findByText('My Profile').click();
};

export const checkUserProfileDetails = ({
    username,
    lastName,
    firstName,
    email,
}) => {
    cy.findByText('My Profile').scrollIntoView();

    cy.findByText(username);
    cy.findByText(lastName);
    cy.findByText(firstName);
    cy.findByText(email);
};

export const checkUserProfileEditDetails = ({
    username,
    lastName,
    firstName,
    email,
}) => {
    cy.findByText('My Profile').scrollIntoView();

    cy.findByText(username);

    cy.findByLabelText('Last Name *').should($input => {
        const value = $input.val();
        expect(value).to.equal(lastName);
    });
    cy.findByLabelText('First Name *').should($input => {
        const value = $input.val();
        expect(value).to.equal(firstName);
    });
    cy.findByLabelText('Email *').should($input => {
        const value = $input.val();
        expect(value).to.equal(email);
    });
};
