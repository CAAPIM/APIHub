import { useEffect, useState } from 'react';
import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';

const getWorkFlowConfigurations = async (url, originHubName) => {
    const fetchJson = getFetchJson(originHubName);
    const { json } = await fetchJson(`${url}/admin/workflowConfigurations`);

    return json;
};

export const useWorkFlowConfigurations = () => {
    const { url, originHubName } = useApiHub();
    const [workFlowConfigurations, setWorkFlowConfigurations] = useState({});

    useEffect(() => {
        getWorkFlowConfigurations(url, originHubName).then(resp => {
            setWorkFlowConfigurations(resp);
        });
    }, [originHubName, url]);

    return workFlowConfigurations;
};
