// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from 'tss-react/mui';
import { Tooltip } from '@mui/material';
import { useSidebarState, useTranslate } from 'react-admin';
import { useApiHubPreference } from './preferences';

export const SidebarButton = props => {
    const { classes, cx } = useStyles();
    const translate = useTranslate();
    const [open, setOpen] = useSidebarState();

    const label = translate(
        open ? 'ra.actions.close_sidebar' : 'ra.actions.open_sidebar'
    );

    const [sidebarOpenPreference, writeSidebarOpenPreference] =
        useApiHubPreference('sidebarOpen');

    useEffect(() => {
        if (sidebarOpenPreference == null) {
            writeSidebarOpenPreference(open);
            return;
        }

        if (sidebarOpenPreference !== open) {
            setOpen(!open);
        }
    }, [open, setOpen, sidebarOpenPreference, writeSidebarOpenPreference]);

    const handleToggleSidebar = () => {
        writeSidebarOpenPreference(!sidebarOpenPreference);
    };

    return (
        <Tooltip title={label}>
            <IconButton
                color="inherit"
                aria-label={label}
                onClick={handleToggleSidebar}
                className={cx(classes.root)}
                {...props}
                size="large"
            >
                <MenuIcon
                    classes={{
                        root: open ? classes.open : classes.closed,
                    }}
                />
            </IconButton>
        </Tooltip>
    );
};

const useStyles = makeStyles({ name: 'Layer7SidebarButton' })(theme => ({
    root: {
        marginLeft: '0.5em',
        marginRight: '0.5em',
    },
    closed: {
        transition: theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        transform: 'rotate(0deg)',
    },
    open: {
        transition: theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        transform: 'rotate(180deg)',
    },
}));
