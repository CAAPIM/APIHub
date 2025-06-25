// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, forwardRef } from 'react';
import { makeStyles } from 'tss-react/mui';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export const LocaleSwitcherMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { onChange, locale, locales, className, ...rest } = props;
    const { classes, cx } = useStyles(props);

    const open = Boolean(anchorEl);

    const handleMenu = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleSetLocale = newLocale => {
        onChange(newLocale);
        handleClose();
    };

    return (
        <>
            <Button
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup={true}
                color="inherit"
                variant="text"
                className={cx(classes.button, className)}
                onClick={handleMenu}
                endIcon={<ArrowDropDownIcon />}
                {...rest}
            >
                {locales[locale]}
            </Button>
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
                {Object.keys(locales).map(key => (
                    <LocaleSwitcherMenuItem
                        key={key}
                        locale={key}
                        onSetLocale={handleSetLocale}
                    >
                        {locales[key]}
                    </LocaleSwitcherMenuItem>
                ))}
            </Menu>
        </>
    );
};

export const LocaleSwitcherMenuItem = forwardRef(
    ({ locale, onSetLocale, ...props }, ref) => {
        return (
            <MenuItem
                ref={ref}
                onClick={() => onSetLocale(locale)}
                {...props}
            />
        );
    }
);

const useStyles = makeStyles({name: 'Layer7LocaleSwitcherMenu'})(
    {
        button: {
            textTransform: 'none',
        },
    }
);
