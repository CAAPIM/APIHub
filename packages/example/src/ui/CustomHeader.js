import React from 'react';
import { makeStyles } from '@material-ui/core';

import { BrandLogo } from '.';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        maxWidth: '500px',
        maxHeight: '140px',
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    logo: {
        height: '100%',
        fill: 'currentColor',
    },
}));

export const CustomHeader = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <BrandLogo className={classes.logo} />
        </div>
    );
};
