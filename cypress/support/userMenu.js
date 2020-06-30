export const openUserMenu = () => {
    cy.findByLabelText('Profile').click({ force: true });
};
