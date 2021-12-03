import React from 'react';
import { ApiHubLayout, useBranding } from 'layer7-apihub';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

import { AppBar } from './AppBar';
import { useTheme } from '../theme';

export const Layout = props => {
    const {
        PAGE_TITLE,
        APIHUB_URL,
        USE_BRANDING_ICONS,
        ORIGIN_HUB_NAME,
        TENANT_NAME,
    } = global.APIHUB_CONFIG;

    const TENANT = TENANT_NAME || guessApihubTenantName();
    const URL = APIHUB_URL || guessApihubUrl();
    const API_URL_WITH_TENANT = `${URL}/api/${TENANT}`;

    const { favicon } = useBranding(API_URL_WITH_TENANT, ORIGIN_HUB_NAME);
    const { theme } = useTheme();

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
            <ApiHubLayout appBar={AppBar} {...props} theme={theme} />
        </>
    );
};
export const guessApihubTenantName = (location = global.window.location) => {
    return location.host.split('.')[0];
};

export const guessApihubUrl = (location = global.window.location) => {
    return get(location, 'origin', '');
};
