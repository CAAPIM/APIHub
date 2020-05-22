import React, { createContext, useContext, useRef } from 'react';
import get from 'lodash/get';

export const ApiHubContext = createContext();

export const ApiHubProvider = ({ url, tenantName, children }) => {
    const value = useRef({
        url,
        urlWithApi: `${url}/api`,
        urlWithTenant: `${url}/api/${tenantName}`,
        tenantName,
    });
    return (
        <ApiHubContext.Provider value={value.current}>
            {children}
        </ApiHubContext.Provider>
    );
};

export const useApiHub = () => useContext(ApiHubContext);

export const guessApihubUrl = (location = global.window.location) => {
    return get(location, 'origin', '');
};

export const guessApihubTenantName = (location = global.window.location) => {
    return location.host.split('.')[0];
};
