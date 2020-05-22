import React, { useEffect } from 'react';
import { useRedirect } from 'react-admin';
import CircularProgress from '@material-ui/core/CircularProgress';

import { CurrentUserId } from '../dataProvider/userContexts';

/**
 * The UserContext is a particular resource that cannot be listed,
 * and that contains only one element.
 * We perform a redirection to the edit page instead of displaying a blank page.
 */
export const UserContextList = () => {
    const redirect = useRedirect();

    useEffect(() => {
        redirect(`/userContexts/${CurrentUserId}/show`);
    }, [redirect]);

    return <CircularProgress size={20} />;
};
