// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
export const openUserMenu = () => {
    cy.findByLabelText('Profile').click({ force: true });
};
