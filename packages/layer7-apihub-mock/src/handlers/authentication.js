import { Response } from 'miragejs';

import {
    deleteCurrentUser,
    getCurrentUser,
    setCurrentUser,
} from './currentUser';
import { promisify } from '../promisify';

const PUBLIC_KEY =
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgVL6G4zaK+ngqrBheIqP1HcqZIdT8cyHJhvZ9rqOSRdemmvMTFsBoJScPAQQl/jlb7VVVvkGdkvSompszpHaIMQxWG6QuBF23v72nu5NmpYDBsyHZHgIROzqdzqycfKhvWrdDFfq17eZmarsNzvc4KVF3CVv+aM4aXmLPXCIMhrq6M+MYcwMYMS5G6JEYXQtvpw5GQHDm6nfTHNds3wBzooakaOMIldae56jRnX+ILeb+yPWmjsPPwbaOjU2cbygNKMHBfnLEFRz05J2XcGh/DGm4x0s12jnPNiH8hkHd8U8bviwvLlreNBM1XCThL0V07HCETzUPQOhpLtplUh7RwIDAQAB';

export function login(database) {
    return async (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);

        // Minimongo does not support mongo array search so we fall back
        // to retrieving all users (we don't have many) and filter ourselves
        const users = await promisify(database.userContexts.find().fetch);
        const user = users.find(
            u => u.userContexts[0].userDetails.username === username
        );

        if (!user || password !== 'Password@1') {
            return new Response(
                401,
                {},
                {
                    respCode: '401',
                    respMsg: `Authentication failed for user '${username}'`,
                    provider: '',
                    referrer: '',
                }
            );
        }
        setCurrentUser(user);

        return {
            respCode: '200',
            respMsg: 'Successfully authenticated user',
            provider: '',
            referrer: '',
            dashboardPath: '',
            gateaugauge: 'mocked-token',
        };
    };
}

export function getPublicKey(database) {
    return (schema, request) => {
        return {
            respCode: 200,
            respMsg: 'Successfully fetched public key',
            publicKey: PUBLIC_KEY,
        };
    };
}

export function resetPassword(database) {
    return (schema, request) => {
        return {
            status: 200,
        };
    };
}

export function checkUserNameIsUnique(database) {
    return async (schema, request) => {
        const username = request.queryParams.Name;

        // Minimongo does not support mongo array search so we fall back
        // to retrieving all users (we don't have many) and filter ourselves
        const users = await promisify(database.userContexts.find().fetch);
        const usersWithSameUsernameExist = users.some(
            u => u.userContexts[0].userDetails.username === username
        );

        if (usersWithSameUsernameExist) {
            return new Response(401, {}, { errors: ['should be unique'] });
        }

        return {
            status: 200,
        };
    };
}

export function passwordResetTokenValidate(database) {
    return (schema, request) => {
        const token = request.queryParams.token;
        if (!['Mithrandir', 'Saruman'].includes(token)) {
            return new Response(401, {}, { errors: ['Token Invalid'] });
        }

        return {
            status: 200,
        };
    };
}

export function updateMyPassword(database) {
    return (schema, request) => {
        const { uuid, newPassword } = JSON.parse(request.requestBody);
        if (
            // The password is encrypted, so we rely on the token to return an error
            uuid === 'Saruman'
        ) {
            return new Response(
                400,
                {},
                {
                    error: {
                        code: 'ValidationException',
                        detail: {
                            devErrorMessage: 'Invalid new password',
                            errorCode: '4755',
                            userErrorKey:
                                'error.validation.password.sameExistingPassword',
                            userErrorMessage:
                                'New password cannot be same as previous passwords.',
                            validationErrors: [
                                {
                                    error:
                                        'Validation Error : New password cannot be same as previous passwords.',
                                    field: 'Password',
                                    key:
                                        'error.validation.password.sameExistingPassword',
                                },
                            ],
                        },
                        message: {
                            lang: 'en',
                            value:
                                'New password cannot be same as previous passwords.',
                        },
                    },
                }
            );
        } else {
            return { status: 200 };
        }
    };
}

export function logout(database) {
    return (schema, request) => {
        deleteCurrentUser();

        return {
            status: 200,
        };
    };
}

export function getAccountSetup(database) {
    return (schema, request) => {
        const token = request.queryParams.token;

        if (token === 'IamLordVoldemort') {
            return {
                email: 'tom@deathlyhallows.com',
                firstName: 'Tom Marvolo',
                lastName: 'Riddle',
            };
        }

        return new Response(401, {}, { errors: ['token not valid'] });
    };
}

export function putAccountSetup(database) {
    return (schema, request) => {
        const token = request.queryParams.token;

        if (token === 'IamLordVoldemort') {
            return {};
        }

        return new Response(401, {}, { errors: ['token not valid'] });
    };
}

export function getUserContexts(database) {
    return (schema, request) => {
        const currentUser = getCurrentUser();

        if (currentUser) {
            return currentUser;
        }
        return new Response(
            401,
            {},
            {
                errors: ['User not authenticated'],
            }
        );
    };
}

export function getCmsSettings(database) {
    return (schema, request) => {
        return {
            REGISTRATION_STATUS: 'ENABLED',
            REGISTRATION_REQUEST_WORKFLOW: 'ENABLED',
            SSO_ENABLED: 'true',
            REGISTRATION_TERMS_OF_USE: `
By clicking "I Accept the Terms and Conditions" you, on behalf of your employer or contracted entity, agree that your use and access to the CA API Management SaaS Portal Application Programmable Interface ("PAPI") will be subject to and governed by this CA API Policy (the "Policy"). You must be authorized to use the CA API Management SaaS Portal by CA or an authorized CA Partner. If you do not, or cannot agree to the Policy, you must not use or access the PAPI. Your continued use of the PAPI constitutes acceptance of any changes to the Policy. Under the Policy, "CA", "we" or "us" means CA Inc., with offices located at 520 Madison Avenue, New York, NY 10022, and its subsidiaries and affiliates.

I. CA makes the PAPI available to provide programmatic access to CA's API Management SaaS Solution. CA reserves the right to discontinue, change, or version the PAPI at any time, in its sole discretion, and makes no guarantees or warranties that the software, scripts or programmatic routines will continue to operate following any changes. CA shall have no liability to you or any third party any downtime, changes or withdrawal of the PAPI. Where possible, we will take commercially reasonable efforts to provide you advanced notice of any changes. CA retains all rights in and to its intellectual property, including but not limited to, the PAPI, software, tools, data materials, information and derivatives or modifications thereof. CA reserves all rights not expressly granted in this Policy.

II. In order to access the PAPI you may be required to provide certain information, you agree that all information is current and accurate. You agree to inform CA of any changes. You may only access and use the PAPI in accordance with the technical documentation supplied by CA. CA may set limits and restrictions around acceptable use of the PAPI. You agree that you will not attempt to disable or circumvent these limitations.

III. You agree that you will not:
a) Sublicense the PAPI to any third party. You further agree that you will not create an API that functions in a substantially similar way to the PAPI and offer it for use to third parties.
b) Perform or take any actions that will introduce any viruses, worms, defects, Trojan horses, malware or have the effect of disabling, interfering, disrupting or impairing the CA product or services.
c) Except where prohibited by law, reverse engineer or decompile any source code through the PAPI or any related CA product or service.
d) Use the PAPI to process or store any sensitive, personal or confidential information.
e) Use the PAPI, directly or indirectly, to benchmark or create a product or service that is substantially similar to the CA API Management SaaS Portal.
f) Remove, alter or obscure any CA marks.
g) Do the following with the PAPI content:
a. Change, alter or misrepresent directly or indirectly the source or ownership in any way
b. Copy, translate, modify, create derivative works, publicly display or sublicense to any third party.
c. Perform any mechanism to keep permanent copies of content or keep content longer than permitted in the cache header.

IV. EXCEPT AS EXPRESSLY STATED HEREIN, CA DOES NOT MAKE ANY REPRESENTATIONS OR WARRANTIES ABOUT THE PAPI. SPECIFICALLY, ITS FUNCTIONALITY, RELIABILITY, AVAILABILITY OR ABILITY TO MEET YOUR SPECIFIC NEEDS OR REQUIREMENTS. THE PAPI IS PROVIDED ON AN "AS-IS" BASIS. EXCEPT WHERE PROHIBITED BY LAW, CA DISCLAIMS THE IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. CA, ITS SUPPLIERS, DISTRIBUTORS AND LICENSORS, WILL NOT BE RESPONSIBLE FOR LOST PROFITS, REVENUES OR DATA; OR INDIRECT, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES, EVEN IF ADVISED IN ADVANCE OF THE POSSIBLE OF SUCH DAMAGES. TO THE EXTENT PERMITTED BY LAW, THE TOTAL LIABILITY OF CA, ITS SUPPLIERS AND DISTRIBUTORS, FOR ANY CLAIM ARISING FROM OR RELATED TO THE POLICY IS LIMITED TO 100.00 USD.

V. You may discontinue using the PAPI at any time. In the event of termination or expiration by you or CA, Sections III, IV and VI will survive.

VI. The governing law and venue for any disputes or claims arising out of or related to the PAPI will be governed by the terms of your agreement with CA for use of the CA API Management SaaS Portal.`,
        };
    };
}

export function getAuthSchemes(database) {
    return (schema, request) => {
        return {
            isOktaProxied: false,
            respCode: 200,
            respMsg: 'Successfully fetched Authentication Schemes',
            publicKey:
                'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj1h7QmwcUR8qW4GtcilTxMmrr/6LYyUuHeBFfeIenZ7aodWOnzDqTl9iAVEOmldcR9QZKq2uzwXyEeiCxnNFf9QK5IFbdF3J1QUteuEhdE1xMQJVn4rjksORpggGGm2HxcrBQFHbeJhmUeNIGEQ+t4Lt+vPzB/6QLwKXppQKK9cgd8cPckVmdQ73g3/LpRDm+VymGkFmTn26ModOJMk0IKJ/8SE5kAPPK8Tmikqj4/TdCxO/JEkgW+JjgigCzmupip+8EZjJT7aYEBYzq9XuQ+008p1/U3dVpR6ngwHYLMBCSufPaP6OuIVvA/VyP8iKqzD6vf1CJ0CBctzEY7bpDQIDAQAB',
            authSchemes: [
                {
                    authMethod: 'DEFAULT',
                    credsReqd: true,
                    defaultConfig: true,
                    description: '',
                    links: [],
                    name: 'CA Technologies Developer Network',
                    showFyp: true,
                    tenantId: 'apim',
                    url: 'https://apim.dev.ca.com/admin/login',
                    uuid: 'f71b8cbc-6b45-4ecc-af9b-a64a98ea317a',
                },
                {
                    advancedConfigurations: { enhancedPasswordSecurity: 'no' },
                    credsReqd: true,
                    defaultConfig: false,
                    description:
                        'OpenLDAP docker container running on this server',
                    links: [],
                    name: 'extuidev OpenLDAP',
                    showFyp: false,
                    tenantId: 'apim',
                    url:
                        'https://apim.dev.ca.com?provider=b5d2c613-67b1-413f-a661-a862d1f0bc0e',
                    uuid: 'b5d2c613-67b1-413f-a661-a862d1f0bc0e',
                },
                {
                    advancedConfigurations: { enhancedPasswordSecurity: 'yes' },
                    credsReqd: true,
                    defaultConfig: false,
                    description: 'LDAP docker container running on this server',
                    links: [],
                    name: 'extuidev LDAP',
                    showFyp: false,
                    tenantId: 'apim',
                    url:
                        'https://apim.dev.ca.com?provider=c5d2c613-67b1-413f-a661-a862d1f0bc0e',
                    uuid: 'c5d2c613-67b1-413f-a661-a862d1f0bc0e',
                },
                {
                    credsReqd: false,
                    defaultConfig: false,
                    description: 'saml test',
                    links: [],
                    name: 'saml',
                    showFyp: false,
                    tenantId: 'bugbashovatssg01gcp-apim-bugbash',
                    url:
                        'https://bugbashovatssg01gcp-apim-bugbash.app.gdue4.saasdev.broadcom.com/api/bugbashovatssg01gcp-apim-bugbash/authenticate/saml/request/e97ef478-70b4-45a8-8a68-444a6140c812',
                    uuid: 'e97ef478-70b4-45a8-8a68-444a6140c812',
                },
            ],
        };
    };
}

const generateMaxLengthValidationError = (key, name, value, maxLength) => {
    return value && value.length > maxLength
        ? {
              [key]: {
                  code: 410,
                  devMessage: `Maximum allowed length for ${name} of ${maxLength} characters has been exceeded`,
                  messageKey: 'error.validation.length.max',
                  localizedMessage: `Field ${name} exceeds the maximum length of ${maxLength}.`,
                  parameters: [name, maxLength],
              },
          }
        : {};
};

export function putUserContexts(database) {
    return async (schema, request) => {
        const { firstName, lastName, email, username } = JSON.parse(
            request.requestBody
        );

        const currentUser = getCurrentUser();

        const validationErrors = {
            ...generateMaxLengthValidationError(
                'FirstName',
                'FIRST_NAME',
                firstName,
                60
            ),
            ...generateMaxLengthValidationError(
                'LastName',
                'LAST_NAME',
                lastName,
                60
            ),
            ...generateMaxLengthValidationError('Email', 'EMAIL', email, 256),
        };

        // Minimongo does not support mongo array search so we fall back
        // to retrieving all users (we don't have many) and filter ourselves
        const users = await promisify(database.userContexts.find().fetch);
        const user = users.find(
            u =>
                u.userContexts[0].userDetails.username ===
                currentUser.userContexts[0].userDetails.username
        );

        user.userContexts[0].userDetails.firstName =
            firstName || user.userContexts[0].userDetails.firstName;
        user.userContexts[0].userDetails.lastName =
            lastName || user.userContexts[0].userDetails.lastName;
        user.userContexts[0].userDetails.email =
            email || user.userContexts[0].userDetails.email;

        await promisify(
            database.userContexts.upsert.bind(database.userContexts),
            user
        );

        setCurrentUser(user);

        if (Object.keys(validationErrors).length > 0) {
            return new Response(
                400,
                {},
                {
                    httpStatusCode: 400,
                    errorCode: 483,
                    devErrorMessage:
                        'The request could not be completed due to data input errors.',
                    userErrorMessage:
                        'The request could not be completed due to data input errors.',
                    locale: 'en',
                    userErrorKey: 'error.validation.entity',
                    validationErrors,
                }
            );
        }

        return {
            status: 200,
        };
    };
}

export function getPasswordPolicy() {
    return (schema, request) => {
        return {
            respCode: 200,
            respMsg: 'Successfully fetched Password Policies',
            authScheme: {
                links: [],
                passwordPolicies: {
                    regexConfig: {
                        UPPERCASE: {
                            value: 1,
                            enabled: true,
                        },
                        NUMBER: {
                            value: 1,
                            enabled: true,
                        },
                        MAXIMUM_LENGTH: {
                            value: 60,
                            enabled: true,
                        },
                        MINIMUM_LENGTH: {
                            value: 8,
                            enabled: true,
                        },
                        REGEX: {
                            value:
                                '^(?=(.*[A-Z]){1})(?=(.*[a-z]){1})(?=(.*[0-9]){1})(?=(.*[!@#$%^&*-]){1})[ A-Za-z0-9!@#$%^&*-]{8,60}$',
                            enabled: true,
                        },
                        SUPPORTED_SYMBOLS: {
                            value: '!@#$%^&*-',
                            enabled: true,
                        },
                        SYMBOL: {
                            value: 1,
                            enabled: true,
                        },
                        LOWERCASE: {
                            value: 1,
                            enabled: true,
                        },
                    },
                    passwordConfig: {
                        PASSWORD_HISTORY: {
                            value: 5,
                            enabled: false,
                        },
                        PASSWORD_EXPIRY: {
                            value: 60,
                            enabled: false,
                        },
                    },
                },
            },
        };
    };
}
