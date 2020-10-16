import { isOrgBoundUser } from '../userContexts';

const STATUS_PENDING_APPROVAL = 'APPLICATION_PENDING_APPROVAL';
const STATUS_EDIT_PENDING_APPROVAL = 'EDIT_APPLICATION_PENDING_APPROVAL';
const DISABLED_BY_TYPE_EXTERNAL = 'EXTERNAL';

export const isApplicationPendingOrDisabled = (status, disabledByType) => {
    return (
        ![DISABLED_BY_TYPE_EXTERNAL, null].includes(disabledByType) ||
        [STATUS_PENDING_APPROVAL, STATUS_EDIT_PENDING_APPROVAL].includes(status)
    );
};

export const isEditApplicationDisabled = (
    userContext,
    { status, disabledByType }
) => {
    return (
        isEditPendingApproval(status) ||
        (isOrgBoundUser(userContext) &&
            isApplicationPendingOrDisabled(status, disabledByType))
    );
};

export const isEditPendingApproval = status => {
    return [STATUS_EDIT_PENDING_APPROVAL].includes(status);
};
