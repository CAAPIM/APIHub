import { getErrorMessage } from '../useLayer7Notify';

// Fake id used because we can only access the current user context
export const CurrentUserId = 'layer7@currentUser';

class UserProfilesValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserProfilesValidationError';
        this.status = 400;
    }
}

export const userProfilesDataProvider = context => {
    const userProfileBasePath = `${context.apiUrl}/userProfile`;
    const pwdPolicyPath = `${context.apiUrl}/public/auth/schemes/passwordpolicy`;

    return {
        getOne: async () => {
            const { json: data } = await context.fetchJson(
                userProfileBasePath,
                {
                    credentials: 'include',
                }
            );

            return {
                data: { ...data, id: CurrentUserId },
            };
        },
        update: async ({ id, data }) => {
            // The update method should only be used to update the user details

            const {
                firstName,
                lastName,
                email,
                userName,
                uuid,
                publicKey,
                password,
                newPassword,
            } = data;
            try {
                const options = {
                    credentials: 'include',
                    method: 'PUT',
                    body: JSON.stringify({
                        password,
                        newPassword,
                        firstName,
                        lastName,
                        email,
                        userName,
                        uuid,
                    }),
                };
                if (publicKey) {
                    options.headers = new Headers({
                        Accept: 'application/json',
                    });
                    options.headers.set('Public-Key', publicKey);
                }
                await context.fetchJson(userProfileBasePath, options);
            } catch (error) {
                const message = getErrorMessage(error);
                throw new UserProfilesValidationError(message);
            }

            return {
                data: {
                    id,
                    ...data,
                },
            };
        },
        getPasswordPolicy: async () => {
            const {
                json: {
                    authScheme: { passwordPolicies },
                },
            } = await context.fetchJson(pwdPolicyPath, {
                credentials: 'include',
            });
            return {
                data: passwordPolicies,
            };
        },
    };
};
