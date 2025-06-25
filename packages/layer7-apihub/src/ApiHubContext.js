// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { createContext, useContext, useRef } from 'react';
import get from 'lodash/get';

export const ApiHubContext = createContext();

export const ApiHubProvider = ({
    url,
    tenantName,
    originHubName,
    children,
}) => {
    const value = useRef({
        originHubName,
        tenantName,
        url,
        urlWithApi: `${url}/api`,
        urlWithTenant: `${url}/api/${tenantName}`,
    });
    return (
        <ApiHubContext.Provider value={value.current}>
            {children}
        </ApiHubContext.Provider>
    );
};

export const useApiHub = () => useContext(ApiHubContext);

export const guessApihubUrl = (location = window.location) => {
    return get(location, 'origin', '');
};

export const guessApihubTenantName = (location = window.location) => {
    return location.host.split('.')[0];
};
