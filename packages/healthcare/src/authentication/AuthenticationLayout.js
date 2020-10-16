import React from 'react';

import { theme } from '../theme';
import { UnAuthenticatedLayoutWithTheme, Header, Footer } from '../layout';

export const AuthenticationLayout = props => {
    return (
        <UnAuthenticatedLayoutWithTheme
            Header={Header}
            Footer={Footer}
            {...props}
            theme={theme}
        />
    );
};
