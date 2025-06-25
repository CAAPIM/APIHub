// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDataProvider } from 'react-admin';

const useApplicationUniqueCheck = (appName, orgUuid, uuid) => {
    const [isNameUnique, setIsNameUnqiue] = useState();
    const dataProvider = useDataProvider();
    const { mutate: checkIsUnique } = useMutation({
        mutationFn: vars =>
            dataProvider.checkApplicationUniqueness('applications', vars),
        onSuccess: ({ data }) => {
            setIsNameUnqiue(data.isNameUnique);
        },
    });

    useEffect(() => {
        if (appName && orgUuid) {
            checkIsUnique({
                applicationName: appName,
                organizationUuid: orgUuid,
                uuid,
            });
        }
    }, [orgUuid, appName]);

    return isNameUnique;
};

export default useApplicationUniqueCheck;
