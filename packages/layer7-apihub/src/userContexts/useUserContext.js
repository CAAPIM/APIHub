// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import {
    useRefresh,
    useRedirect,
    useGetOne,
    useUpdate,
    useDataProvider,
} from 'react-admin';
import merge from 'lodash/merge';
import { useMutation } from '@tanstack/react-query';

import { useLayer7Notify } from '../useLayer7Notify';
import { CurrentUserId } from '../dataProvider/userContexts';

export const useUserContext = redirectTo => {
    const notify = useLayer7Notify();
    const refresh = useRefresh();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();

    // Pass a fake id because we can only access the current user context
    const { data: userContext } = useGetOne('userContexts', {
        id: CurrentUserId,
    });

    const [updateProfile] = useUpdate();

    const { mutate: updateActiveOrganization } = useMutation({
        mutationFn: ({ id, data }) =>
            dataProvider.updateActiveOrganization('userContexts', { id, data }),
    });

    const handleChangeUserProfile = newUserContext => {
        updateProfile(
            'userContexts',
            {
                id: CurrentUserId,
                data: merge(userContext, newUserContext),
            },
            {
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
                onError: () => {
                    notify(
                        'resources.userContexts.userDetails.notifications.update_error',
                        'error'
                    );
                },
            }
        );
    };

    const handleChangeUserActiveOrganization = newUserContext => {
        updateActiveOrganization(
            {
                id: CurrentUserId,
                data: merge(userContext, newUserContext),
            },
            {
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
                onError: error => {
                    notify(
                        error ||
                            'resources.userContexts.activeOrgUuid.notifications.update_error',
                        'error'
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
