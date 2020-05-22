import { openUserMenu } from './userMenu';

export const login = (username, password) => {
    cy.window().then(win => win.Layer7Mock.deleteCurrentUser());
    cy.visit('/#/login');

    cy.findByLabelText('Username *').type(username);
    cy.findByLabelText('Password *').type(password);

    cy.findByText('Sign in').click();

    cy.findByRole('progressbar').should('not.be.visible');
    cy.url().should('not.include', '/login');
};

export const logout = () => {
    openUserMenu();

    cy.findByText('Logout').click();

    cy.url().should('include', '/login');
};
