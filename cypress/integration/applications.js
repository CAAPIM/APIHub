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

        cy.findByLabelText('API Key / Client ID').should(
            'contain',
            'b43b8e38-511a-4234-b533-4264a8fcaa26'
        );

        cy.findByLabelText('Shared Secret / Client Secret').should(
            'contain',
            'cf4f15ea-b8c5-453c-8072-9b5115db5eb9'
        );

        cy.findByLabelText('Callback/Redirect URL(s)').should(
            'contain',
            'https://example.com/oauthCallback'
        );

        cy.findByLabelText('Scope').should('contain', 'OOB');

        cy.findByLabelText('Type').should('contain', 'confidential');
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
});
