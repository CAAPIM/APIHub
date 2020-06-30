import React from 'react';
import { ApiHubLayout, useBranding } from 'layer7-apihub';
import { Helmet } from 'react-helmet';

import { useTheme } from '../theme';
import { AppBar } from './AppBar';

export const Layout = props => {
    const {
        PAGE_TITLE,
        APIHUB_URL,
        USE_BRANDING_ICONS,
        ORIGIN_HUB_NAME,
    } = global.APIHUB_CONFIG;

    const theme = useTheme();
    const { favicon } = useBranding(APIHUB_URL, ORIGIN_HUB_NAME);

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
