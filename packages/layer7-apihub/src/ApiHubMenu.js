import React from 'react';
import { MenuItemLink } from 'react-admin';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';
import { makeStyles, useMediaQuery } from '@material-ui/core';

import { IconHome, IconApi, IconApps } from './ui/icons';

const useStyles = makeStyles(
    {
        main: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
        },
    },
    { name: 'RaMenu' }
);

/**
 * The ApiHub Menu used in the ApiHub Sidebar.
 *
 * Inspired by https://github.com/marmelab/react-admin/blob/2c167a4693b4ca060f72b272f19e9af8f41eb091/packages/ra-ui-materialui/src/layout/Menu.tsx
 *
 * @param {*} props Menu properties
 */
export const ApiHubMenu = props => {
    const {
        classes: classesOverride,
        className,
        dense,
        hasDashboard,
        onMenuClick = () => null,
        logout,
        ...rest
    } = props;

    const translate = useTranslate();
    const classes = useStyles(props);
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const open = useSelector(state => state.admin.ui.sidebarOpen);

    // Used to force redraw on navigation
    useSelector(state => state.router.location.pathname);

    return (
        <div className={classnames(classes.main, className)} {...rest}>
            {hasDashboard && (
                <MenuItemLink
                    onClick={onMenuClick}
                    to="/"
                    exact
                    primaryText={translate('ra.page.dashboard')}
                    leftIcon={<IconHome />}
                    dense={dense}
                    sidebarIsOpen={open}
                    {...rest}
                />
            )}
            <MenuItemLink
                key="apis"
                to="/apis"
                primaryText={translate(`resources.apis.name`, {
                    smart_count: 2,
                })}
                leftIcon={<IconApi />}
                onClick={onMenuClick}
                dense={dense}
                sidebarIsOpen={open}
            />
            <MenuItemLink
                key="applications"
                to="/applications"
                primaryText={translate(`resources.applications.name`, {
                    smart_count: 2,
                })}
                leftIcon={<IconApps />}
                onClick={onMenuClick}
                dense={dense}
                sidebarIsOpen={open}
            />
            {isXSmall && logout}
        </div>
    );
};
