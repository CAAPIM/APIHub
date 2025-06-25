// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { useEffect, useState } from 'react';
import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';
import { forEach, get } from 'lodash';

const getWorkFlowConfiguration = async (url, originHubName, setting) => {
    const fetchJson = getFetchJson(originHubName);
    const {
        json: { uuid, ...data },
    } = await fetchJson(`${url}/tenant-admin/1.0/settings/${setting}`);
    return get(data, 'value', '');
};

export const useWorkFlowConfigurations = () => {
    const { urlWithTenant, originHubName } = useApiHub();
    const [workFlowConfigurations, setWorkFlowConfigurations] = useState({});

    useEffect(() => {
        const flagsMap = {
            APPLICATION_REQUEST_WORKFLOW: 'applicationRequestWorkflowStatus',
            EDIT_APPLICATION_REQUEST_WORKFLOW:
                'editApplicationRequestWorkflowStatus',
            DELETE_APPLICATION_REQUEST_WORKFLOW:
                'deleteApplicationRequestWorkflowStatus',
        };
        forEach(flagsMap, (value, key) => {
            getWorkFlowConfiguration(urlWithTenant, originHubName, key).then(
                resp => {
                    setWorkFlowConfigurations(previousValue => ({
                        ...previousValue,
                        [value]: resp,
                    }));
                }
            );
        });
    }, [originHubName, urlWithTenant]);

    return workFlowConfigurations;
};
