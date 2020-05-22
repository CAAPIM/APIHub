import React, { cloneElement } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { HideOnScroll, LoadingIndicator, useLocale } from 'react-admin';
import { ApiHubUserMenu } from './ApiHubUserMenu';
import { ApiHubLanguageSwitcher } from './ApiHubLanguageSwitcher';
import { SidebarButton } from './SidebarButton';

const useStyles = makeStyles(
    theme => ({
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
    }),
    { name: 'RaAppBar' }
);

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
    logout,
    open,
    sidebarButton,
    title,
    userMenu,
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
    useLocale(); // Make sure the locale change would rerender the component

    return (
        <HideOnScroll>
            <AppBar
                className={className}
                color="secondary"
                elevation={0}
                {...rest}
            >
                <Toolbar
                    disableGutters
                    variant="regular"
                    className={classes.toolbar}
                >
                    {cloneElement(sidebarButton, { open })}
                    <div className={classes.header}>{children}</div>
                    <LoadingIndicator />
                    {cloneElement(languagesMenu)}
                    <Divider
                        className={classes.divider}
                        orientation="vertical"
                    />
                    {cloneElement(userMenu, { logout })}
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
