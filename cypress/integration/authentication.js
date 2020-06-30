import { login, logout } from '../support/login';

import authenticationData from '../data/authenticationData.json';

describe('Authentication', () => {
    it('should login to the platform as an administrator', () => {
        cy.loadData(authenticationData);

        login('portalAdmin', 'Password@1');

        logout();
    });

    it('should login to the platform as a developer', () => {
        cy.loadData(authenticationData);

        login('user', 'Password@1');

        logout();
    });
});
