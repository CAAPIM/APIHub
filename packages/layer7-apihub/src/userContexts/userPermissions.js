// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { get } from 'lodash';

/**
 * Detect if the user is a portal admin from the user context.
 *
 * @param {object} userContext The user context
 */
export function isPortalAdmin(userContext) {
    return !!get(userContext, 'userDetails.portalAdmin', null);
}

/**
 * Detect if the user is a publisher from the user context.
 *
 * @param {object} userContext The user context
 */
export function isPublisher(userContext) {
    const portalAdmin = !!get(userContext, 'userDetails.portalAdmin', null);
    const apiOwner = !!get(userContext, 'userDetails.apiOwner', null);
    const orgPublisher = !!get(userContext, 'userDetails.orgPublisher', null);

    return portalAdmin || apiOwner || orgPublisher;
}

/**
 * Detect if the user is an org bound user from the user context.
 *
 * @param {object} userContext The user context
 */
export function isOrgBoundUser(userContext) {
    const orgPublisher = !!get(userContext, 'userDetails.orgPublisher', null);
    const orgAdmin = !!get(userContext, 'userDetails.orgAdmin', null);
    const developer = !!get(userContext, 'userDetails.developer', null);

    return orgAdmin || orgPublisher || developer;
}

/**
 * Detect if the user is an admin user and not a developer from the user context.
 *
 * @param {object} userContext The user context
 */
export function isAdminUser(userContext) {
    const portalAdmin = !!get(userContext, 'userDetails.portalAdmin', null);
    const apiOwner = !!get(userContext, 'userDetails.apiOwner', null);
    const orgPublisher = !!get(userContext, 'userDetails.orgPublisher', null);
    const orgAdmin = !!get(userContext, 'userDetails.orgAdmin', null);
    const developer = !!get(userContext, 'userDetails.developer', null);

    return (portalAdmin || apiOwner || orgAdmin || orgPublisher) && !developer;
}

/**
 * Detect if the user is an admin from the user context.
 *
 * @param {object} userContext The user context
 */
export function isOrgAdmin(userContext) {
    return !!get(userContext, 'userDetails.orgAdmin', null);
}
