// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { ResetPasswordConfirm } from './ResetPasswordConfirm';
import { render } from '@testing-library/react';
import { AdminContext } from 'react-admin';

describe('ResetPasswordConfirm', () => {
    it('renders a password reset confirmation message', () => {
        const { getByText } = render(
            <AdminContext>
                <ResetPasswordConfirm />
            </AdminContext>
        );

        expect(getByText('apihub.reset_password_confirm.title')).not.toBeNull();
        expect(
            getByText('apihub.reset_password_confirm.form_details.instructions')
        ).not.toBeNull();
        expect(
            getByText('apihub.reset_password_confirm.form_details.description')
        ).not.toBeNull();
    });
});
