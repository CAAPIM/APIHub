// / <reference types="Cypress" />

import { login } from '../support/login';

describe.skip('Wiki', () => {
    before(() => {
        cy.clearLocalStorageCache();
    });

    beforeEach(() => {
        cy.restoreLocalStorageCache();
    });

    afterEach(() => {
        cy.saveLocalStorageCache();
    });

    it('should open the first document by default for all languages', () => {
        cy.loadData();

        login('user', 'Password@1');

        cy.findAllByText('Wiki')
            .first()
            .click();

        cy.findByText('en-US - Enhanced optimal Graphical User Interface');
        cy.findByText(
            'Eligendi omnis consequuntur consequatur corporis assumenda sed nihil unde. Omnis tenetur quam. Consequatur sapiente est aut laudantium voluptates nemo reiciendis explicabo excepturi.'
        );

        cy.findByLabelText('Selected language').click();
        cy.findByText('Français').click();

        cy.findByText('fr-FR - Business-focused zero tolerance middleware');
        cy.findByText(
            'Nihil ex repellendus dolorem suscipit aspernatur non deleniti quia. Qui non et quod esse in velit earum. Doloribus rerum suscipit rerum et libero quae asperiores distinctio. Dolorum pariatur exercitationem quibusdam sunt. Ipsa sint totam sit ut quis veniam sint. Fugiat velit delectus reiciendis unde.'
        );
    });

    it('should allow to create, edit and delete documents', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        cy.findAllByText('Wiki')
            .first()
            .click();

        // 1. New Document

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

        // The new document should be added in the tree
        cy.findAllByLabelText('New document').should('have.length', 0);
        cy.findByLabelText('A new root');
        cy.findAllByText('Some markdown').should('have.length', 1);

        // 2. New Child Document

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

        // 3. Edit Child Document

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

        // 4. Delete Child Document

        cy.findByLabelText('Delete').click();
        cy.findAllByText('Document successfully deleted.');

        cy.get('#react-admin-title').click(); // Cancel the notification by clicking on the page title

        cy.findByLabelText('A new root');
        cy.findAllByLabelText('A better child').should('have.length', 0);
    });

    it('should allow to edit other languages for documentation', () => {
        cy.loadData();

        login('portalAdmin', 'Password@1');

        cy.findAllByText('Wiki')
            .first()
            .click();

        // Has english documentation by default
        cy.findByText('en-US - Enhanced optimal Graphical User Interface');

        cy.findByLabelText('Selected language').click();
        cy.findByText('Français').click();

        // Has french documentation loaded
        cy.findByText(
            'fr-FR - Business-focused zero tolerance middleware'
        ).click();
        cy.findByLabelText('Edit').click();
        cy.findByDisplayValue(
            'fr-FR - Business-focused zero tolerance middleware'
        )
            .clear()
            .type('fr-FR Une baguette!');
        cy.findByLabelText('Publish').click();
        cy.findByText('fr-FR Une baguette!');

        cy.findByLabelText('Selected language').click();
        cy.findByText('English', { selector: '[role=menuitem]' }).click();
        cy.findAllByText('fr-FR Une baguette!').should('have.length', 0);
        cy.findByText('en-US - Enhanced optimal Graphical User Interface');
    });

    it('should not allow a user without edition rights to edit the documentation', () => {
        cy.loadData();

        login('user', 'Password@1');

        cy.findAllByText('Wiki')
            .first()
            .click();

        cy.findByText(
            'en-US - Enhanced optimal Graphical User Interface'
        ).click();
        cy.findByText(
            'Eligendi omnis consequuntur consequatur corporis assumenda sed nihil unde. Omnis tenetur quam. Consequatur sapiente est aut laudantium voluptates nemo reiciendis explicabo excepturi.'
        );
        cy.findAllByLabelText('Edit').should('have.length', 0);
    });
});
