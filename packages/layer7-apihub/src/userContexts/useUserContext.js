import {
    useNotify,
    useRefresh,
    useRedirect,
    useGetOne,
    useUpdate,
    useMutation,
    CRUD_GET_ONE,
    CRUD_UPDATE,
} from 'ra-core';
import merge from 'lodash/merge';

import { CurrentUserId } from '../dataProvider/userContexts';

export const useUserContext = redirectTo => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    // Pass a fake id because we can only access the current user context
    const { data: userContext } = useGetOne('userContexts', CurrentUserId, {
        action: CRUD_GET_ONE,
    });

    const [updateProfile] = useUpdate('userContexts', CurrentUserId);

    const [updateActiveOrganization] = useMutation({
        type: 'updateActiveOrganization',
        resource: 'userContexts',
    });

    const handleChangeUserProfile = newUserContext => {
        updateProfile(
            {
                payload: {
                    id: CurrentUserId,
                    data: merge(userContext, newUserContext),
                },
            },
            {
                action: CRUD_UPDATE,
                onSuccess: () => {
                    notify(
                        'resources.userContexts.userDetails.notifications.update_success',
                        'info'
                    );
                    if (redirectTo) {
                        redirect(redirectTo);
                    }
                    refresh();
                },
                onFailure: () => {
                    notify(
                        'resources.userContexts.userDetails.notifications.update_error',
                        'warning'
                    );
                },
            }
        );
    };

    const handleChangeUserActiveOrganization = newUserContext => {
        updateActiveOrganization(
            {
                payload: {
                    id: CurrentUserId,
                    data: merge(userContext, newUserContext),
                },
            },
            {
                action: CRUD_UPDATE,
                onSuccess: () => {
                    notify(
                        'resources.userContexts.activeOrgUuid.notifications.update_success',
                        'info'
                    );
                    // We should perform a redirection before refreshing the view,
                    // because the current view may not be accessible for the new organization.
                    if (redirectTo) {
                        redirect(redirectTo);
                    }
                    refresh();
                },
                onFailure: () => {
                    notify(
                        'resources.userContexts.activeOrgUuid.notifications.update_error',
                        'warning'
                    );
                },
            }
        );
    };
    return [
        userContext,
        handleChangeUserProfile,
        handleChangeUserActiveOrganization,
    ];
};
