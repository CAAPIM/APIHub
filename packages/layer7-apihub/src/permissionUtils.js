// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { get } from 'lodash';

export const hasCRUDPermissions = (user, types, param) => {
    const permissions = get(user, `permissions[${param}]`);
    if (permissions && permissions.length > 0) {
        if (types.every(type => permissions.includes(type))) {
            return true;
        }
    }
    return false;
};

export const PERMISSIONS_CREATE = 'CREATE';
export const PERMISSIONS_DELETE = 'DELETE';
export const PERMISSIONS_READ = 'READ';
export const PERMISSIONS_UPDATE = 'UPDATE';

export const API_KEYS_APPLICATION = 'API_KEYS_APPLICATION';
