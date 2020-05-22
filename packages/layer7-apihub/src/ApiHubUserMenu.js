import React, { Children, cloneElement, isValidElement, useState } from 'react';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Link, useLocation } from 'react-router-dom';

import { CurrentUserId } from './dataProvider/userContexts';
import { UserOrganizationSwitcher, useUserContext } from './userContexts';

const useStyles = makeStyles(
    theme => ({
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
    }),
    {
        name: 'RaUserMenu',
    }
);

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
    const classes = useStyles(props);
    const [anchorEl, setAnchorEl] = useState(null);

    const redirectTo = useResourceListLocation();
    const [
        userContext,
        _handleChangeUserProfile, // eslint-disable-line no-unused-vars
        handleChangeUserActiveOrg,
    ] = useUserContext(redirectTo);

    const { children, label, icon, logout } = props;

    if (!logout && !children) {
        return null;
    }

    const userName = userContext
        ? translate('apihub.menu.user_details.full_name', {
              last_name: userContext.userDetails.lastName,
              first_name: userContext.userDetails.firstName,
          })
        : '';

    const open = Boolean(anchorEl);

    const handleMenu = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

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
                    to={`/userContexts/${CurrentUserId}/show`}
                    onClick={handleClose}
                    className={classes.menuItem}
                >
                    <ListItemIcon className={classes.icon}>
                        <AccountCircle />
                    </ListItemIcon>
                    {translate('resources.userContexts.actions.edit_profile')}
                </MenuItem>
                <Divider className={classes.divider} />
                <UserOrganizationSwitcher
                    userContext={userContext}
                    onChangeUserContext={handleChangeUserActiveOrg}
                />
                {Children.map(children, menuItem =>
                    isValidElement(menuItem)
                        ? cloneElement(menuItem, {
                              className: classes.menuItem,
                              onClick: handleClose,
                          })
                        : null
                )}
                {cloneElement(logout, {
                    className: classnames(
                        classes.menuItem,
                        classes.menuItemLogout
                    ),
                })}
            </Menu>
        </div>
    );
};

ApiHubUserMenu.defaultProps = {
    label: 'ra.auth.user_menu',
    icon: <AccountCircle />,
};
