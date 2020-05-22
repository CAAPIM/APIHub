import defaultData from '../data/defaultData.json';

Cypress.Commands.add('loadData', (data = defaultData) => {
    cy.visit('/#/login');
    cy.window().then(win => win.Layer7Mock.clearDatabase());
    cy.window().then(win => win.Layer7Mock.initDatabase(data));
});
