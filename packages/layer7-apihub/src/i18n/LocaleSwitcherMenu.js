import React, { useState, forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import classnames from 'classnames';

const useStyles = makeStyles(
    {
        button: {
            textTransform: 'none',
        },
    },
    { name: 'Layer7LocaleSwitcherMenu' }
);

export const LocaleSwitcherMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { onChange, locale, locales, className, ...rest } = props;
    const classes = useStyles(props);

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
                className={classnames(classes.button, className)}
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
