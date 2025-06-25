// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { login } from '../support/login';
import defaultData from '../../packages/layer7-apihub-mock/src/defaultData.json';

describe('Homepage', () => {
    before(() => {
        cy.clearLocalStorageCache();
    });

    beforeEach(() => {
        cy.restoreLocalStorageCache();
    });

    afterEach(() => {
        cy.saveLocalStorageCache();
    });

    describe('as an admin user', () => {
        it('should create a new homepage', () => {
            const emptyHomepageData = {
                ...defaultData,
                apis: [],
                applications: [],
                tags: [],
                documents: [],
                assets: [],
                apiGroups: [],
                registrations: [],
                customFields: [],
                apiEulas: [],
            };
            cy.loadData(emptyHomepageData);

            login('portalAdmin', 'Password@1');

            cy.findByTitle('Create')
                .should('exist')
                .click();

            cy.findByLabelText('Content').type('My New Homepage');

            cy.findByText('Publish').click();

            // Discard notification
            cy.findByText(
                'Copyright © 2020 Broadcom. All Rights Reserved'
            ).click({ force: true });
            cy.wait(250);

            cy.findByText('My New Homepage');
        });

        it('should edit the homepage', () => {
            cy.loadData();

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
            cy.loadData();
            login('user', 'Password@1');
            cy.findByTitle('Create').should('not.exist');
        });
    });
});
