export const openUserMenu = () => {
    cy.findByTitle('Profile').click({ force: true });
};
