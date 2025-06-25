// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { isOrgBoundUser } from '../userContexts';

const STATUS_PENDING_APPROVAL = 'APPLICATION_PENDING_APPROVAL';
const STATUS_EDIT_PENDING_APPROVAL = 'EDIT_APPLICATION_PENDING_APPROVAL';
const STATUS_DELETE_PENDING_APPROVAL = 'DELETE_APPLICATION_PENDING_APPROVAL';
const DISABLED_BY_TYPE_EXTERNAL = 'EXTERNAL';
const STATUS_DELETE_FAILED = 'DELETE_FAILED';

export const isApplicationPendingOrDisabled = (status, disabledByType) => {
    return (
        [DISABLED_BY_TYPE_EXTERNAL].includes(disabledByType) ||
        [STATUS_PENDING_APPROVAL, STATUS_DELETE_PENDING_APPROVAL].includes(
            status
        )
    );
};

export const isEditApplicationDisabled = (
    userContext,
    { status, disabledByType }
) => {
    return (
        (isOrgBoundUser(userContext) &&
            isApplicationPendingOrDisabled(status, disabledByType)) ||
        status === STATUS_DELETE_FAILED
    );
};

export const isEditPendingApproval = status => {
    return [STATUS_EDIT_PENDING_APPROVAL].includes(status);
};

const STATUS_APPLICATION_DETAILS = 'APPLICATION_DETAILS';
const STATUS_APPLICATION_CUSTOM_FIELDS = 'APPLICATION_CUSTOM_FIELDS';
const STATUS_APPLICATION_API_PLANS = 'APPLICATION_API_PLANS';
const STATUS_APPLICATION_PATCH_API_PLANS = 'PATCH_APPLICATION_API_PLANS';
const STATUS_APPLICATION_APIS = 'APPLICATION_APIS';
const STATUS_APPLICATION_PATCH_APIS = 'PATCH_APPLICATION_APIS';
const STATUS_APPLICATION_API_GROUPS = 'APPLICATION_API_GROUPS';
const STATUS_APPLICATION_API_KEYS = 'APPLICATION_API_KEYS';

const isAppInLockableState = status =>
    status === 'ENABLED' ||
    status === 'DISABLED' ||
    status === 'EDIT_APPLICATION_PENDING_APPROVAL';

export const isEditDetailsPending = (userContext, appRequestStatus, status) => {
    return (
        isOrgBoundUser(userContext) &&
        appRequestStatus[STATUS_APPLICATION_DETAILS] &&
        isAppInLockableState(status)
    );
};

export const isEditCustomFieldsPending = (
    userContext,
    appRequestStatus,
    status
) => {
    return (
        isOrgBoundUser(userContext) &&
        appRequestStatus[STATUS_APPLICATION_CUSTOM_FIELDS] &&
        isAppInLockableState(status)
    );
};

export const isEditAPIPlansPending = (
    userContext,
    appRequestStatus,
    status
) => {
    return (
        (appRequestStatus[STATUS_APPLICATION_API_PLANS] ||
            appRequestStatus[STATUS_APPLICATION_PATCH_API_PLANS]) &&
        isAppInLockableState(status)
    );
};

export const isEditAPIsPending = (userContext, appRequestStatus, status) => {
    return (
        (appRequestStatus[STATUS_APPLICATION_APIS] ||
            appRequestStatus[STATUS_APPLICATION_PATCH_APIS]) &&
        isAppInLockableState(status)
    );
};

export const isEditAPIGroupsPending = (
    userContext,
    appRequestStatus,
    status
) => {
    return (
        isOrgBoundUser(userContext) &&
        appRequestStatus[STATUS_APPLICATION_API_GROUPS] &&
        isAppInLockableState(status)
    );
};

export const isEditAPIKeysPending = (userContext, appRequestStatus, status) => {
    return (
        isOrgBoundUser(userContext) &&
        appRequestStatus[STATUS_APPLICATION_API_KEYS] &&
        isAppInLockableState(status)
    );
};
