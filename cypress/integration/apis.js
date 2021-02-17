// / <reference types="Cypress" />

import { login } from '../support/login';

describe('Apis', () => {
    before(() => {
        cy.clearLocalStorageCache();
    });

    beforeEach(() => {
        cy.restoreLocalStorageCache();
    });

    afterEach(() => {
        cy.saveLocalStorageCache();
    });

    it('should find an api in the datagrid and in the list of cards', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        // As a datagrid

        cy.findByTitle('Display as list').click();

        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('GB International Tactics');

        // As a list of cards

        cy.findByTitle('Display as cards').click();

        cy.findByTitle('GB International Tactics');
    });

    it('should show an api details', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('GB International Tactics').click();

        // Overview Tab
        cy.findByLabelText('State').should('contain', 'Enabled');
        cy.findByLabelText('Version').should('contain', 'v5.2.5');
        cy.findByLabelText('Visibility').should('contain', 'Public');
        cy.findByLabelText('Modified').should('contain', '4/28/2020');
        cy.findByLabelText('Description').should(
            'contain',
            'Vision-oriented 24/7 moderator'
        );
        cy.findByLabelText('Tags').should('contain', 'Accounts');
        cy.findByLabelText('Tags').should('contain', 'Organizations');
        cy.findByLabelText('Tags').should('contain', 'Plans');

        cy.findByLabelText('Assets').should('contain', 'paradigm.json');
        cy.findByLabelText('Assets').should(
            'contain',
            'hard_drive_auto_loan_account_fish.json'
        );
        cy.findByLabelText('Download Assets');

        // Specs Tab
        cy.findByText('Specs').click();
        cy.contains('[ Base URL: /login ]');

        // Documentation Tab
        cy.findByText('Documentation').click();
        cy.findByLabelText(
            'en-US - Synergized transitional application'
        ).click();
        // Documentation content
        cy.contains('Quo sunt tempore id sequi nesciunt illo quod aut.');
        // Documentation children
        cy.findAllByLabelText(
            'en-US - Multi-channelled systemic knowledge base'
        );
    });

    it('should open the first document by default', () => {
        login('portalAdmin', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('GB International Tactics').click();

        cy.findByText('Documentation').click();
        cy.findByText('en-US - Integrated high-level encoding');
        cy.contains(
            'Quam temporibus maxime voluptatem aliquam sunt nostrum accusamus'
        );
    });

    it('should allow to create, edit and delete documents', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('XML Customer Integration').click();

        cy.findByText('Documentation').click();
        cy.findByLabelText('New root document').click();
        // A new root node should have been added in the tree
        cy.findByLabelText('New document');
        // A form input with a default title should be displayed
        cy.findByDisplayValue('New document')
            .clear()
            .type('A new root');
        // A form input with a default navtitle generated from title should be diplayed
        cy.findByDisplayValue('A-new-root')
            .clear()
            .type('a-new-root');
        cy.findAllByLabelText('Content *').type('Some markdown');
        cy.findAllByText('Some markdown').should('have.length', 2);
        cy.findByLabelText('Publish').click();
        cy.findAllByLabelText('New document').should('have.length', 0);
        cy.findByLabelText('A new root');
        cy.findAllByText('Some markdown').should('have.length', 1);

        cy.findAllByLabelText('New child').click();
        // A new root node should have been added in the tree
        // And it should be visible immediatly as its parent should be
        // automatically expanded when adding a child
        cy.findByLabelText('New document');
        // A form input with a default title should be displayed
        cy.findByDisplayValue('New document')
            .clear()
            .type('A new child');
        // A form input with a default navtitle generated from title should be diplayed
        cy.findByDisplayValue('A-new-child')
            .clear()
            .type('a-new-child');
        cy.findAllByLabelText('Content *').type('Some markdown for child');
        cy.findAllByText('Some markdown for child').should('have.length', 2);
        cy.findByLabelText('Publish').click();
        cy.findAllByLabelText('New document').should('have.length', 0);
        cy.findByLabelText('A new child');
        cy.findAllByText('Some markdown for child').should('have.length', 1);

        cy.findByLabelText('Edit').click();
        cy.findByDisplayValue('A new child')
            .clear()
            .type('A better child');
        cy.findByDisplayValue('Some markdown for child')
            .clear()
            .type('Some better markdown for child');
        cy.findByLabelText('Publish').click();
        cy.findByLabelText('A better child');
        cy.findByText('Some better markdown for child');
        cy.findByLabelText('Delete').click();
        cy.findAllByText('Document successfully deleted.');

        cy.get('#react-admin-title').click(); // Cancel the notification by clicking on the page title

        cy.findByLabelText('A new root');
        cy.findAllByLabelText('A better child').should('have.length', 0);
    });

    it('should allow to edit other languages for documentation', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('PCI Direct Functionality').click();

        cy.findByText('Documentation').click();

        // Has english documentation by default
        cy.findByText('en-US - Up-sized high-level pricing structure');

        cy.findByLabelText('Selected language').click();
        cy.findByText('Français').click();

        // Has french documentation loaded
        cy.findByText('fr-FR - Managed even-keeled architecture').click();
        cy.findByLabelText('Edit').click();
        cy.findByDisplayValue('fr-FR - Managed even-keeled architecture')
            .clear()
            .type('fr-FR Une baguette!');
        cy.findByLabelText('Publish').click();
        cy.findByText('fr-FR Une baguette!');

        cy.findByLabelText('Selected language').click();
        cy.findByText('English', { selector: '[role=menuitem]' }).click();
        cy.findAllByText('fr-FR Une baguette!').should('have.length', 0);
        cy.findByText('en-US - Up-sized high-level pricing structure');
    });

    it('should not allow a user without edition rights to edit the documentation', () => {
        cy.loadData();

        login('user', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('GB International Tactics').click();

        cy.findByText('Documentation').click();

        cy.findByText('en-US - Synergized transitional application').click();
        cy.contains('Quo sunt tempore id sequi nesciunt illo quod aut.');
        cy.findAllByLabelText('Edit').should('have.length', 0);
    });

    context('specs tab', () => {
        it('autocomplete to find api key and shared secret', () => {
            cy.loadData();

            login('portalAdmin', 'Password@1');

            cy.findAllByText('APIs')
                .first()
                .click();

            cy.findByTitle('Display as list').click();

            cy.findByText('Name').click({ force: true });

            cy.findByText('HTTP Global Branding').click();

            cy.findByText('Specs').click();

            cy.findByLabelText('Search or Select Application')
                .click()
                .clear()
                .type('AD');

            cy.findByText('ADP Dynamic Integration').click();

            /* cy.get('#api-key-ed3b7fce-df49-4c23-ac1a-8ff4cf1c6fe2').findByText(
                '69a3c6c2-100b-4c01-9a38-87f7ce238fb4'
            );

            cy.get(
                '#shared-secret-ed3b7fce-df49-4c23-ac1a-8ff4cf1c6fe2'
            ).findByText('6eaf450f-4ab8-4666-9a78-6ccdaf5bbbb7'); */
        });
    });
});
