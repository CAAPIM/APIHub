import { useState, useEffect } from 'react';
import { useMutation } from 'react-admin';

const useApplicationUniqueCheck = (appName, orgUuid, uuid) => {
    const [isNameUnique, setIsNameUnqiue] = useState();
    const [
        checkIsUnique,
        { data: uniqueTestResult, loading: checkingUniqueNess },
    ] = useMutation({
        type: 'checkApplicationUniqueness',
        resource: 'applications',
        payload: {
            applicationName: appName,
            organizationUuid: orgUuid,
            uuid,
        },
    });

    useEffect(() => {
        if (appName && orgUuid) {
            checkIsUnique();
        }
    }, [orgUuid, appName]);

    useEffect(() => {
        if (!checkingUniqueNess && uniqueTestResult) {
            setIsNameUnqiue(uniqueTestResult.isNameUnique);
        }
    }, [uniqueTestResult, checkingUniqueNess]);
    return isNameUnique;
};

export default useApplicationUniqueCheck;
