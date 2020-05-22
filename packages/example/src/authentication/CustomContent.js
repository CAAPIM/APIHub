import React from 'react';
import { makeStyles } from '@material-ui/core';

import { ContentLogo } from '../ui';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            maxWidth: '700px',
            margin: theme.spacing(2),
        },
    },
    logo: {
        height: '100%',
        width: '100%',
    },
}));

export const CustomContent = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ContentLogo className={classes.logo} />
        </div>
    );
};
