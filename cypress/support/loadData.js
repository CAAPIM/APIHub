import defaultData from '../data/defaultData.json';

Cypress.Commands.add('loadData', (data = defaultData) => {
    cy.visit('/#/login');
    cy.wait(250);
    cy.window()
        .its('Layer7Mock')
        .should('not.be.undefined');
    cy.window().then(win => win.Layer7Mock.resetDatabase(data));
    cy.wait(250);
});
