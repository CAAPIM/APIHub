import React from 'react';
import { makeStyles } from '@material-ui/core';

import { BrandLogo } from '.';
import { useTheme } from '../theme';

export const Header = () => {
    const classes = useStyles();
    const { logo } = useTheme();
    return (
        <div className={classes.root}>
            <BrandLogo className={classes.logo} img={logo} />
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        maxWidth: '20%',
        minWidth: '300px',
        maxHeight: '140px',
        textAlign: 'center',
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    logo: {
        height: '100%',
        fill: 'currentColor',
    },
}));
