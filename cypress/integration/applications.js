// / <reference types="Cypress" />

import { login } from '../support/login';

describe('Applications', () => {
    it('should find an application in the datagrid and in the list of cards', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        cy.findAllByText('Applications')
            .first()
            .click();

        // As a datagrid

        cy.findByTitle('Display as list').click();

        cy.findByTitle('ATP International Identity'); // Name
        cy.findByTitle('Balanced coherent intranet'); // Description

        // As a list of cards

        cy.findByTitle('Display as cards').click();

        cy.findByTitle('ATP International Identity'); // Name
        cy.findByTitle('Balanced coherent intranet'); // Description
    });

    it('should show an application details', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        cy.findAllByText('Applications')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByTitle('ATP International Identity').click({ force: true });

        // Overview

        cy.findByLabelText('Overview').should('contain', 'No value');
        cy.findByLabelText('API Key / Client ID').should(
            'contain',
            '06f4fb4d-80f4-49fd-bfb5-6154889eda03'
        );
        cy.findByLabelText('Shared Secret / Client Secret').should(
            'contain',
            'c369e771-0fe0-4814-b11b-20e32a2cbd7e'
        );

        cy.findByLabelText('Description').should(
            'contain',
            'Balanced coherent intranet'
        );
        cy.findByLabelText('OAuth Callback URL').should(
            'contain',
            'https://example.com/oauthCallback'
        );
        cy.findByLabelText('OAuth Scope').should('contain', 'OOB');
        cy.findByLabelText('OAuth Type').should('contain', 'confidential');

        cy.findByLabelText('Generate New Secret').should('exist');
    });

    it('should show generate secret ', () => {
        login('orgPublisher', 'Password@1');

        cy.findAllByText('Applications')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByTitle('ATP International Identity').click({ force: true });

        // Overview

        cy.findByLabelText('Generate New Secret').should('exist');
    });

    it('should NOT show Generate New Secret when Application status is APPLICATION_PENDING_APPROVAL for an org user', () => {
        login('orgPublisher', 'Password@1');

        cy.findAllByText('Applications')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByTitle('COM Principal Web').click({ force: true });

        // Details
        cy.findByLabelText('Generate New Secret').should('not.exist');
    });
    it('should show Generate New Secret when Application status is APPLICATION_PENDING_APPROVAL for a portal admin', () => {
        login('portalAdmin', 'Password@1');

        cy.findAllByText('Applications')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByTitle('COM Principal Web').click({ force: true });

        // Details
        cy.findByLabelText('Generate New Secret').should('exist');
    });
});
