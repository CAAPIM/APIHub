import { login } from '../support/login';

describe('Applications', () => {
    before(() => {
        cy.loadData();
    });

    beforeEach(() => {
        login('portalAdmin', 'Password@1');
    });

    it('should find an application in the datagrid and in the list of cards', () => {
        cy.findAllByText('Applications')
            .first()
            .click();

        // As a datagrid

        cy.findByTitle('Display as list').click();

        cy.findByText('Name').click(); // Sort by name

        cy.findByTitle('ATP International Identity');

        // As a list of cards

        cy.findByTitle('Display as cards').click();

        cy.findByTitle('ATP International Identity');
    });
});
