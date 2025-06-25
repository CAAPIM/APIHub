// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { Children, cloneElement, isValidElement, useState } from 'react';
import { useTranslate, Logout } from 'react-admin';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { makeStyles } from 'tss-react/mui';
import Divider from '@mui/material/Divider';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link, useLocation } from 'react-router-dom';
import { CurrentUserId } from './dataProvider/userContexts';
import { UserOrganizationSwitcher, useUserContext } from './userContexts';

/**
 * An hook to get the path of the related list of resources
 * from the current location.
 *
 * @example <caption>Simple usage</caption>
 *
 * const MyComponent = () => {
 *     const location = useLocation();
 *     console.log(location.pathname); // Shows "/apis/uuid-of-api/show"
 *
 *     const resourceListLocation = useResourceListLocation();
 *     console.log(resourceListLocation) // Show "/apis"
 * };
 *
 */
export const useResourceListLocation = () => {
    const location = useLocation();
    const RESOURCE_LIST_MATCH = /\/[^/]*/;
    const match = location.pathname.match(RESOURCE_LIST_MATCH);
    return match[0];
};

/**
 * The ApiHub UserMenu used in the ApiHub AppBar.
 *
 * @param {*} props UserMenu properties
 *
 * @example <caption>Simple usage</caption>
 * <ApiHubUserMenu />
 *
 * const MyAppBar = props => <ApiHubAppBar userMenu={ApiHubUserMenu} {...props} />
 *
 */
export const ApiHubUserMenu = props => {
    const translate = useTranslate();
    const { classes, cx } = useStyles(props);
    const [anchorEl, setAnchorEl] = useState(null);

    const redirectTo = useResourceListLocation();
    const [
        userContext,
        _handleChangeUserProfile, // eslint-disable-line no-unused-vars
        handleChangeUserActiveOrg,
    ] = useUserContext(redirectTo);

    const {
        children,
        label = 'ra.auth.user_menu',
        icon = <AccountCircle />,
    } = props;

    const userName = userContext
        ? translate('apihub.menu.user_details.full_name', {
              last_name: userContext?.userDetails?.lastName
                  ? userContext.userDetails.lastName
                  : '',
              first_name: userContext?.userDetails?.firstName
                  ? userContext.userDetails.firstName
                  : '',
          })
        : '';

    const open = Boolean(anchorEl);

    const handleMenu = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleChangeUserContext = value => {
        handleChangeUserActiveOrg(value);
        handleClose();
    };

    return (
        <div>
            <Tooltip title={label && translate(label, { _: label })}>
                <Button
                    aria-label={label && translate(label, { _: label })}
                    aria-owns={open ? 'menu-appbar' : null}
                    aria-haspopup
                    color="inherit"
                    onClick={handleMenu}
                    startIcon={icon}
                    endIcon={<ArrowDropDownIcon />}
                    key={userName}
                >
                    {userName}
                </Button>
            </Tooltip>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem
                    component={Link}
                    to={`/userProfiles/${CurrentUserId}/show`}
                    onClick={handleClose}
                    className={classes.menuItem}
                >
                    <ListItemIcon className={classes.icon}>
                        <AccountCircle />
                    </ListItemIcon>
                    {translate('resources.userProfiles.actions.edit_profile')}
                </MenuItem>
                <Divider className={classes.divider} />
                <UserOrganizationSwitcher
                    userContext={userContext}
                    onChangeUserContext={handleChangeUserContext}
                />
                {Children.map(children, menuItem =>
                    isValidElement(menuItem)
                        ? cloneElement(menuItem, {
                              className: classes.menuItem,
                              onClick: handleClose,
                          })
                        : null
                )}
                <Logout
                    classNames={cx(classes.menuItem, classes.menuItemLogout)}
                />
            </Menu>
        </div>
    );
};

const useStyles = makeStyles({ name: 'ApiHubUserMenu' })(theme => ({
    menuItem: {
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(),
    },
    menuItemLogout: {
        marginBottom: '0px',
    },
    divider: {
        marginBottom: theme.spacing(),
    },
    icon: {
        minWidth: theme.spacing(5),
    },
}));
