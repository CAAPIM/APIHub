import { login, logout } from '../support/login';

describe('Authentication', () => {
    before(() => {
        cy.loadData();
    });

    it('should login to the platform as an administrator', () => {
        login('portalAdmin', 'Password@1');
        logout();
    });

    it('should login to the platform as a developer', () => {
        login('user', 'Password@1');
        logout();
    });
});
