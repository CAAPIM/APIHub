// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { useState, useEffect, useCallback } from 'react';
import { guessApihubTenantName, guessApihubUrl } from './ApiHubContext';
import { getFetchJson } from './fetchUtils';

export const useConfig = () => {
    const config = global.APIHUB_CONFIG;
    const ORIGIN_HUB_NAME = config.ORIGIN_HUB_NAME;
    const APIHUB_URL = config.APIHUB_URL || guessApihubUrl();
    const [tenantName, setTenantName] = useState(config.TENANT_NAME);

    const fetchTenantName = useCallback(async () => {
        if (!tenantName) {
            const fetchJson = getFetchJson(ORIGIN_HUB_NAME);
            const { json } = await fetchJson(`${APIHUB_URL}/admin/cmsSettings`);
            let tenantId =
                json['TENANT_ID'] ||
                guessApihubTenantName(APIHUB_URL, ORIGIN_HUB_NAME);
            setTenantName(tenantId);
        }
    }, []);

    useEffect(() => {
        fetchTenantName();
    }, [fetchTenantName]);

    return { APIHUB_URL, ORIGIN_HUB_NAME, TENANT_NAME: tenantName };
};
