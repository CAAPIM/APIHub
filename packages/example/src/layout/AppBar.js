// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useEffect } from 'react';
import { HideOnScroll, LoadingIndicator, useTranslate } from 'react-admin';
import MuiAppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from 'tss-react/mui';
import LightModeIcon from '@mui/icons-material/Brightness7';
import DarkModeIcon from '@mui/icons-material/Brightness4';
import {
    ApiHubUserMenu,
    ApiHubLanguageSwitcher,
    SidebarButton,
    useApiHubPreference,
} from 'layer7-apihub';
import { BrandLogo } from '../ui';
import { useTheme } from '../theme';
import { useTheme as useThemePreference } from 'react-admin';

export const AppBar = ({
    children,
    classes: classesOverride,
    className,
    languagesMenu = <ApiHubLanguageSwitcher />,
    sidebarButton = <SidebarButton />,
    userMenu = <ApiHubUserMenu />,
    ...rest
}) => {
    const { classes } = useStyles({ classes: classesOverride });
    const { logo } = useTheme();
    return (
        <HideOnScroll>
            <MuiAppBar
                className={className}
                color="default"
                enableColorOnDark={true}
                elevation={2}
                {...rest}
            >
                <Toolbar
                    disableGutters
                    variant="regular"
                    className={classes.toolbar}
                >
                    {sidebarButton}
                    <div className={classes.header}>
                        <BrandLogo
                            className={classes.logo}
                            fill="#fff"
                            img={logo}
                        />
                    </div>
                    <LoadingIndicator />
                    {!global.APIHUB_CONFIG.USE_BRANDING_THEME ? (
                        <ThemeModeButton />
                    ) : null}
                    {languagesMenu}
                    <Divider
                        className={classes.divider}
                        orientation="vertical"
                    />
                    {userMenu}
                </Toolbar>
            </MuiAppBar>
        </HideOnScroll>
    );
};

const useStyles = makeStyles({ name: 'ExampleAppBar' })(
    (theme, { classes }) => ({
        toolbar: {
            paddingRight: 24,
            backgroundColor: theme.palette.customHeader?.main,
            color: theme.palette.getContrastText(
                theme.palette.customHeader?.main || theme.palette.common.white
            ),
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
        logo: {
            height: theme.spacing(6),
            padding: '10px',
        },
        ...classes,
    })
);

export const ThemeModeButton = () => {
    const { classes } = useThemeModeButtonStyles();
    const translate = useTranslate();

    const [themeMode, setThemeMode] = useThemePreference();
    const [themeModePreference, setThemeModePreference] =
        useApiHubPreference('themeMode');

    useEffect(() => {
        if (themeModePreference && themeModePreference !== themeMode) {
            setThemeMode(themeModePreference);
        }
    }, [themeModePreference, themeMode, setThemeMode]);

    const handleClick = () => {
        const newTheme = themeMode === 'light' ? 'dark' : 'light';
        setThemeModePreference(newTheme);
    };

    return (
        <Tooltip title={translate('example.action.toggle_dark_mode')}>
            <IconButton onClick={handleClick} size="large">
                {themeMode === 'light' ? (
                    <DarkModeIcon className={classes.icon} />
                ) : (
                    <LightModeIcon className={classes.icon} />
                )}
            </IconButton>
        </Tooltip>
    );
};

const useThemeModeButtonStyles = makeStyles()(theme => ({
    icon: {
        color: theme.palette.common.white,
    },
}));
