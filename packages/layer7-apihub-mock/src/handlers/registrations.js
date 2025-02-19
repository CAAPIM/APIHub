import { Response } from 'miragejs';
import { promisify } from '../promisify';

export function postRegistration(database) {
    return async (schema, request) => {
        const registration = JSON.parse(request.requestBody);

        const existingRegistration = await promisify(
            database.registrations.findOne.bind(database.registrations),
            { email: registration.email },
            {}
        );

        if (existingRegistration) {
            return new Response(551, undefined, {
                error: {
                    code: 'ValidationException',
                    message: {
                        lang: 'en',
                        value:
                            'Registration request for this email is pending approval/activation. Multiple requests are not allowed.',
                    },
                    detail: {
                        errorCode: '551',
                        devErrorMessage:
                            'Registration request for this email is pending approval/activation. Multiple requests are not allowed.',
                        userErrorMessage:
                            'Registration request for this email is pending approval/activation. Multiple requests are not allowed.',
                        userErrorKey:
                            'error.user.create.fail.limituserregistration',
                    },
                },
            });
        }

        await promisify(
            database.registrations.upsert.bind(database.registrations),
            {
                ...registration,
            }
        );

        return new Response(201, {}, {});
    };
}
