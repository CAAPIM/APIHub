// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { ApiHubLayout, useBranding } from 'layer7-apihub';
import { Helmet } from 'react-helmet';

import { AppBar } from './AppBar';
import { useAppConfig } from '../contexts/ConfigContext';

export const Layout = props => {
    const {
        PAGE_TITLE,
        APIHUB_URL,
        USE_BRANDING_ICONS,
        ORIGIN_HUB_NAME,
        TENANT_NAME,
    } = useAppConfig();

    const API_URL_WITH_TENANT = `${APIHUB_URL}/api/${TENANT_NAME}`;

    const { favicon } = useBranding(API_URL_WITH_TENANT, ORIGIN_HUB_NAME);

    return (
        <>
            <Helmet title={PAGE_TITLE}>
                {USE_BRANDING_ICONS && favicon && (
                    <link
                        id="favicon"
                        rel="icon"
                        href={favicon}
                        type="image/x-icon"
                    />
                )}
            </Helmet>
            <ApiHubLayout appBar={AppBar} {...props} />
        </>
    );
};
