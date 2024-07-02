import { useEffect, useState } from 'react';
import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';
import { forEach, get } from 'lodash';

const getWorkFlowConfiguration = async (url, originHubName, setting) => {
    const fetchJson = getFetchJson(originHubName);
    const {
        json: { Uuid, ...data },
    } = await fetchJson(`${url}/Settings('${setting}')`);
    return get(data, 'Value', '');
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
