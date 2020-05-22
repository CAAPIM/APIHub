import { login } from '../support/login';

describe('Homepage', () => {
    describe('as an admin user', () => {
        before(() => {
            cy.loadData();
        });

        beforeEach(() => {
            login('portalAdmin', 'Password@1');
        });

        it('should create a new homepage', () => {
            cy.findByTitle('Create')
                .should('exist')
                .click();

            cy.findByLabelText('Content')
                .clear()
                .type('My New Homepage');

            cy.findByText('Publish').click();

            // Discard notification
            cy.findByText(
                'Copyright © 2020 Broadcom. All Rights Reserved'
            ).click({ force: true });
            cy.wait(250);

            cy.findByText('My New Homepage');
        });

        it('should edit the homepage', () => {
            cy.findByTitle('Edit')
                .should('exist')
                .click();

            cy.findByLabelText('Content')
                .clear()
                .type('My Updated Homepage');

            cy.findByText('Publish').click();

            // Discard notification

            cy.findByText(
                'Copyright © 2020 Broadcom. All Rights Reserved'
            ).click({ force: true });
            cy.wait(250);

            cy.findByText('My Updated Homepage');
        });
    });

    describe('as a non admin user', () => {
        after(() => {
            cy.window().then(win => {
                win.Layer7Mock.clearDatabase();
                win.Layer7Mock.initDatabase();
            });
        });

        beforeEach(() => {
            login('user', 'Password@1');
        });

        it('should not be able to create a new homepage', () => {
            cy.findByTitle('Create').should('not.exist');
        });
    });
});
