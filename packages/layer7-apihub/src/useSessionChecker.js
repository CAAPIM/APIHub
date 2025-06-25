// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { getFetchJson } from './fetchUtils';
import { useApiHub } from './ApiHubContext';

export const useSessionChecker = () => {
    const { pathname } = useLocation();
    const { url, originHubName } = useApiHub();
    const fetchJson = getFetchJson(originHubName);

    React.useEffect(async () => {
        const apiURL = `${url}/dev/config.json`;
        try {
            await fetchJson(apiURL, {
                credentials: 'include',
            });
        } catch {}
    }, [fetchJson, pathname, url]);
};
