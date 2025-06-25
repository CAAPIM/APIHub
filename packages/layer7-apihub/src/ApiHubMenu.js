// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import {
    MenuItemLink,
    useHasDashboard,
    useTranslate,
    Logout,
} from 'react-admin';
import { useMediaQuery } from '@mui/material';

import { makeStyles } from 'tss-react/mui';

import { IconHome, IconApi, IconApps, IconWiki } from './ui/icons';
import { useTheme } from '@mui/material/styles';

/**
 * The ApiHub Menu used in the ApiHub Sidebar.
 *
 * Inspired by https://github.com/marmelab/react-admin/blob/2c167a4693b4ca060f72b272f19e9af8f41eb091/packages/ra-ui-materialui/src/layout/Menu.tsx
 *
 * @param {*} props Menu properties
 */
export const ApiHubMenu = props => {
    const { className } = props;
    const translate = useTranslate();
    const { classes, cx } = useStyles(props);
    const theme = useTheme();
    const isXSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const hasDashboard = useHasDashboard();

    return (
        <div className={cx(classes.main, className)}>
            {hasDashboard && (
                <MenuItemLink
                    to="/"
                    primaryText={translate('ra.page.dashboard')}
                    leftIcon={<IconHome />}
                />
            )}
            <MenuItemLink
                key="apis"
                to="/apis"
                primaryText={translate(`resources.apis.name`, {
                    smart_count: 2,
                })}
                leftIcon={<IconApi />}
            />
            <MenuItemLink
                key="applications"
                to="/applications"
                primaryText={translate(`resources.applications.name`, {
                    smart_count: 2,
                })}
                leftIcon={<IconApps />}
            />
            <MenuItemLink
                key="documents"
                to="/wiki"
                primaryText={translate(`resources.documents.name`, {
                    smart_count: 2,
                })}
                leftIcon={<IconWiki />}
            />
            {isXSmall && <Logout />}
        </div>
    );
};

const useStyles = makeStyles({ name: 'RaMenu' })({
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
});
