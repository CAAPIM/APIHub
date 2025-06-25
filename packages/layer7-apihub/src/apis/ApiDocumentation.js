// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';

import { Documentation as BaseDocumentation } from '../documentation';
import { useGetRecordId } from 'react-admin';

export const ApiDocumentation = ({
    userCanDelete,
    userCanEdit,
    entityType,
}) => {
    const apiId = useGetRecordId();

    return (
        <BaseDocumentation
            userCanDelete={userCanDelete}
            userCanEdit={userCanEdit}
            entityUuid={apiId}
            entityType={entityType}
        />
    );
};
