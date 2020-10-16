import { login, logout } from '../support/login';

describe.skip('Authentication', () => {
    it('should login to the platform as an administrator', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        logout();
    });

    it('should login to the platform as a developer', () => {
        cy.loadData();

        login('user', 'Password@1');

        logout();
    });
});
