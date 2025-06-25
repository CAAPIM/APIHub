// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from 'tss-react/mui';
import { HideOnScroll, LoadingIndicator } from 'react-admin';
import { ApiHubUserMenu } from './ApiHubUserMenu';
import { ApiHubLanguageSwitcher } from './ApiHubLanguageSwitcher';
import { SidebarButton } from './SidebarButton';

/**
 * The ApiHub AppBar used in the ApiHub Layout.
 *
 * @param {*} props AppBar properties
 */
export const ApiHubAppBar = ({
    children,
    classes: classesOverride,
    className,
    languagesMenu,
    logo,
    sidebarButton,
    userMenu,
    ...rest
}) => {
    const { classes } = useStyles({ classes: classesOverride });

    return (
        <HideOnScroll>
            <AppBar
                className={className}
                color="secondary"
                elevation={0}
                enableColorOnDark={true}
                {...rest}
            >
                <Toolbar
                    disableGutters
                    variant="regular"
                    className={classes.toolbar}
                >
                    {sidebarButton}
                    <div className={classes.header}>{children}</div>
                    <LoadingIndicator />
                    {languagesMenu}
                    <Divider
                        className={classes.divider}
                        orientation="vertical"
                    />
                    {userMenu}
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
};

ApiHubAppBar.defaultProps = {
    userMenu: <ApiHubUserMenu />,
    languagesMenu: <ApiHubLanguageSwitcher />,
    sidebarButton: <SidebarButton />,
};

const useStyles = makeStyles({ name: 'Layer7AppBar' })(
    (theme, { classes }) => ({
        toolbar: {
            paddingRight: 24,
        },
        header: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            minWidth: '156px',
        },
        divider: {
            alignSelf: 'stretch',
            backgroundColor: theme.palette.primary.contrastText,
            height: 'auto',
            marginBottom: theme.spacing(2),
            marginLeft: theme.spacing(4),
            marginRight: theme.spacing(4),
            marginTop: theme.spacing(2),
        },
        ...classes,
    })
);
