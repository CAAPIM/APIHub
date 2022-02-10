import { Response } from 'miragejs';

import { getCurrentUser, setCurrentUser } from './currentUser';
import { promisify } from '../promisify';

export function getUserProfile(database) {
    return (schema, request) => {
        const { userContexts } = getCurrentUser();
        const { userDetails } = userContexts[0];
        const {
            uuid,
            firstName,
            lastName,
            email,
            username: userName,
        } = userDetails;

        return new Response(
            200,
            {},
            {
                uuid,
                firstName,
                lastName,
                email,
                userName,
            }
        );
    };
}

export function putUserProfile(database) {
    return async (schema, request) => {
        const { firstName, lastName, email } = JSON.parse(request.requestBody);

        const currentUser = getCurrentUser();

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

        return {
            status: 200,
        };
    };
}
