import { fetchUtils } from 'ra-core';
import get from 'lodash/get';

// Fake id used because we can only access the current user context
export const CurrentUserId = 'layer7@currentUser';

const buildErrorMessage = error => {
    const message = get(error, 'body.userErrorMessage', '');
    const validationErrors = get(error, 'body.validationErrors', {});
    const validationMessages = Object.keys(validationErrors)
        .map(validationField =>
            get(validationErrors, `${validationField}.localizedMessage`, '')
        )
        .join(' ');

    return `${message} ${validationMessages}`;
};

class UserContextsValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserContextsValidationError';
        this.status = 400;
    }
}

export const userContextsDataProvider = baseUrl => {
    const basePath = `${baseUrl}/userContexts`;

    return {
        getOne: async () => {
            const { json: data } = await fetchUtils.fetchJson(basePath, {
                credentials: 'include',
            });

            if (!data || !data.userContexts || !data.userContexts.length > 0) {
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
        },
        update: async ({ id, data }) => {
            // The update method should only be used to update the user details

            const {
                userDetails: { firstName, lastName, email, username, uuid },
            } = data;

            try {
                await fetchUtils.fetchJson(basePath, {
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
                const message = buildErrorMessage(error);
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
                await fetchUtils.fetchJson(basePath, {
                    credentials: 'include',
                    method: 'PUT',
                    body: JSON.stringify({
                        orgUuid: data.activeOrgUuid,
                    }),
                });
            } catch (error) {
                const message = buildErrorMessage(error);
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
