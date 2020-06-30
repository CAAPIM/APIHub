import { login } from '../support/login';

import homepageData from '../data/homepageData.json';
import homepageDataEmpty from '../data/homepageDataEmpty.json';

describe('Homepage', () => {
    describe('as an admin user', () => {
        it('should create a new homepage', () => {
            cy.loadData(homepageDataEmpty);

            login('portalAdmin', 'Password@1');

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
            cy.loadData(homepageData);

            login('portalAdmin', 'Password@1');

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
        it('should not be able to create a new homepage', () => {
            cy.loadData(homepageDataEmpty);
            login('user', 'Password@1');
            cy.findByTitle('Create').should('not.exist');
        });
    });
});
