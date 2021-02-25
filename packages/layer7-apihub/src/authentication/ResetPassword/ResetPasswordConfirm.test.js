import React from 'react';
import { ResetPasswordConfirm } from './ResetPasswordConfirm';
import { renderWithRedux } from 'ra-core';

describe('ResetPasswordConfirm', () => {
    it('renders a password reset confirmation message', () => {
        const { getByText } = renderWithRedux(<ResetPasswordConfirm />);

        expect(getByText('apihub.reset_password_confirm.title')).not.toBeNull();
        expect(getByText('apihub.reset_password_confirm.form_details.instructions')).not.toBeNull();
        expect(getByText('apihub.reset_password_confirm.form_details.description')).not.toBeNull();
    });
});
