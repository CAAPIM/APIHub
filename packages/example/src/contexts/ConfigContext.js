// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { createContext, useContext } from 'react';
import { useConfig } from 'layer7-apihub';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const globalConfig = global.APIHUB_CONFIG || {};

    // Use useConfig hook to get resolved values
    const {
        APIHUB_URL: resolvedUrl,
        TENANT_NAME: resolvedTenantName,
        ORIGIN_HUB_NAME: resolvedOriginHubName,
    } = useConfig();

    // Priority: global config > resolved config
    const config = {
        APIHUB_URL: globalConfig.APIHUB_URL || resolvedUrl,
        TENANT_NAME: globalConfig.TENANT_NAME || resolvedTenantName,
        ORIGIN_HUB_NAME: globalConfig.ORIGIN_HUB_NAME || resolvedOriginHubName,
        USE_BRANDING_THEME: globalConfig.USE_BRANDING_THEME || false,
        USE_BRANDING_ICONS: globalConfig.USE_BRANDING_ICONS || false,
        PAGE_TITLE: globalConfig.PAGE_TITLE,
        ENABLE_MOCK: globalConfig.ENABLE_MOCK,
    };

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useAppConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useAppConfig must be used within a ConfigProvider');
    }
    return context;
};
