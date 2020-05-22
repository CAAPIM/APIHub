import get from 'lodash/get';

/**
 * Detect if the user is a publisher from the user context.
 *
 * @param {object} userContext The user context
 */
export const isPublisher = userContext => {
    const portalAdmin = !!get(userContext, 'userDetails.portalAdmin', null);
    const apiOwner = !!get(userContext, 'userDetails.apiOwner', null);
    const orgPublisher = !!get(userContext, 'userDetails.orgPublisher', null);

    return portalAdmin || apiOwner || orgPublisher;
};
