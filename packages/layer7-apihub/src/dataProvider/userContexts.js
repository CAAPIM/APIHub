// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { getErrorMessage } from '../useLayer7Notify';

// Fake id used because we can only access the current user context
export const CurrentUserId = 'layer7@currentUser';

class UserContextsValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserContextsValidationError';
        this.status = 400;
    }
}

export const userContextsDataProvider = context => {
    const basePath = `${context.apiUrl}/userContexts`;

    return {
        getOne: async () => {
            try {
                const { json: data } = await context.fetchJson(basePath, {
                    credentials: 'include',
                });
                if (
                    !data ||
                    !data.userContexts ||
                    !data.userContexts.length > 0
                ) {
                    const customError = {
                        status: 404,
                        message:
                            'resources.userContexts.notifications.profile_not_exist_error',
                    };
                    throw customError;
                }

                const userContext = data.userContexts[0];

                return {
                    data: { ...userContext, id: CurrentUserId },
                };
            } catch (error) {
                const message = getErrorMessage(error);
                throw new UserContextsValidationError(message);
            }
        },
        update: async ({ id, data }) => {
            // The update method should only be used to update the user details

            const {
                userDetails: { firstName, lastName, email, username, uuid },
            } = data;

            try {
                await context.fetchJson(basePath, {
                    credentials: 'include',
                    method: 'PUT',
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        username,
                        uuid,
                    }),
                });
            } catch (error) {
                const message = getErrorMessage(error);
                throw new UserContextsValidationError(message);
            }

            return {
                data: {
                    id,
                    ...data,
                },
            };
        },
        updateActiveOrganization: async ({ id, data }) => {
            // The updateActiveOrganization method should only be used to update the user active organization

            try {
                await context.fetchJson(basePath, {
                    credentials: 'include',
                    method: 'PUT',
                    body: JSON.stringify({
                        orgUuid: data.activeOrgUuid,
                    }),
                });
            } catch (error) {
                const message = getErrorMessage(error);
                throw new UserContextsValidationError(message);
            }

            return {
                data: {
                    id,
                    ...data,
                },
            };
        },
    };
};
