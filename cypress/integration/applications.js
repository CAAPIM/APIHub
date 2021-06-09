// / <reference types="Cypress" />

import { login } from '../support/login';

describe('Applications', () => {
    before(() => {
        cy.clearLocalStorageCache();
    });

    beforeEach(() => {
        cy.restoreLocalStorageCache();
    });

    afterEach(() => {
        cy.saveLocalStorageCache();
    });

    it('should find an application in the datagrid and in the list of cards', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        cy.findAllByText('Applications')
            .first()
            .click();

        // As a datagrid

        cy.findByTitle('Display as list').click();

        cy.findByTitle('CSS Human Intranet'); // Name
        cy.findByTitle('Self-enabling global workforce'); // Description

        // As a list of cards

        cy.findByTitle('Display as cards').click();

        cy.findByTitle('CSS Human Intranet'); // Name
        cy.findByTitle('Self-enabling global workforce'); // Description
    });

    it('should show an application details', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        cy.findAllByText('Applications')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByTitle('CSS Human Intranet').click({ force: true });

        // Overview

        cy.findByLabelText('Overview').should('contain', 'No value');

        cy.get('#description').should(
            'contain',
            'Self-enabling global workforce'
        );

        cy.findByText('JSON Chief Directives').click();

        cy.findByLabelText('API Key / Client ID').should(
            'contain',
            'l7286a421be91244e79a43faf333fbdd14'
        );

        cy.findByLabelText('Shared Secret / Client Secret').should(
            'contain',
            '********'
        );

        cy.findByLabelText('Callback/Redirect URL(s)').should(
            'contain',
            'https://example.com/oauthCallback'
        );

        cy.findByLabelText('Scope').should('contain', 'OOB');

        cy.findByLabelText('Type').should('contain', 'public');
    });

    it('should NOT show Generate New Secret when Application status is APPLICATION_PENDING_APPROVAL for an org user', () => {
        login('orgPublisher', 'Password@1');

        cy.findAllByText('Applications')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByTitle('GB Future Response').click({ force: true });

        // Details
        cy.findByLabelText('Generate New Secret').should('not.exist');
    });

    context('when editing an application', () => {
        it('should allow the changing of an API plan on a selected API', () => {
            cy.loadData();
            login('orgAdmin', 'Password@1');
            cy.findAllByText('Applications')
                .first()
                .click();

            cy.findByTitle('Display as list').click();
            cy.findByTitle('CSS Human Intranet').click({ force: true });

            // Ignore any errors in the console
            cy.on('uncaught:exception', (err, runnable) => {
                cy.findByText('Edit').click({ force: true });

                // Click the first selected API from the selector widget to open the accordion
                cy.findByText('SMTP Chief Accounts').click({ force: true });

                // Click to edit the API plan
                cy.findByText('API Plan: API Plan 1');
                cy.findByTitle('Edit').click({ force: true });

                // Choose a different API plan from the modal
                cy.findByText('Select an API Plan (Required)');
                cy.findByText('API Plan 3').click({ force: true });

                // Accept the terms and conditions of the new API plan
                cy.findByText('Lorem ipsum dolor sit amet');
                cy.findByText('I Accept the Terms & Conditions').click({
                    force: true,
                });

                // The first API plan should be replaced with the new one chosen
                cy.findByText('API Plan: API Plan 3');
                return false;
            });
        });

        it('should show the API key as the default key', () => {
            cy.loadData();
            login('orgAdmin', 'Password@1');
            cy.findAllByText('Applications')
                .first()
                .click();

            cy.findByTitle('Display as list').click();
            cy.findByTitle('CSS Human Intranet').click({ force: true });

            // Ignore any errors in the console
            cy.on('uncaught:exception', (err, runnable) => {
                cy.findByText('Edit').click({ force: true });

                // Click the first selected API from the selector widget to open the accordion
                cy.findByText('SMTP Chief Accounts').click({ force: true });

                // Click to edit the API plan
                cy.findByText('API Plan: API Plan 1');
                cy.findByTitle('Edit').click({ force: true });

                expect(
                    cy.findByText('API Key / Client ID').next().innerHTML
                ).toEqual('Default');

                return false;
            });
        });

        it('should display a progress dialog when deleting', () => {
            cy.loadData();
            login('orgAdmin', 'Password@1');
            cy.findAllByText('Applications')
                .first()
                .click();

            cy.findByTitle('Display as list').click();
            cy.findByTitle('ADP Dynamic Integration').click({ force: true });
            cy.on('uncaught:exception', (err, runnable) => {
                cy.findByText('Delete').click({ force: true });

                cy.findByText(
                    'You are about to delete this application. Are you sure?'
                );

                cy.findByText('Delete').click({ force: true });

                cy.findByText(
                    'Undeploying keys and deleting application. This may take several minutes.'
                );

                return false;
            });
        });
    });

    it.skip('should show generate secret ', () => {
        login('orgPublisher', 'Password@1');

        cy.findAllByText('Applications')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByTitle('CSS Human Intranet').click({ force: true });

        cy.findByText('Edit').click();

        cy.findByLabelText('Generate New Secret').should('exist');
    });

    it.skip('should show Generate New Secret when Application status is APPLICATION_PENDING_APPROVAL for a portal admin', () => {
        login('portalAdmin', 'Password@1');

        cy.findAllByText('Applications')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByTitle('GB Future Response').click({ force: true });

        // Details
        cy.findByLabelText('Generate New Secret').should('exist');
    });

    it.skip('should change the page size', () => {
        login('portalAdmin', 'Password@1');

        cy.findAllByText('Applications')
            .first()
            .click();

        cy.get('p.MuiTablePagination-caption').should(
            'have.text',
            'Items per page:1-12 of 25'
        );
        cy.get('div.MuiTablePagination-input')
            .first()
            .click({ force: true });
        cy.findByText('24').click({ force: true });
        cy.get('p.MuiTablePagination-caption').should(
            'have.text',
            'Items per page:1-24 of 25'
        );
    });
});
