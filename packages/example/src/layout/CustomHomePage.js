import React from 'react';
import { HomePageContent } from 'layer7-apihub';
import { makeStyles } from '@material-ui/core/styles';

import { ContentLogo } from '../ui';
import { CustomFooter } from '../ui/CustomFooter';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
    markdown: {
        '& > h2': {
            marginTop: theme.spacing(4),
            fontSize: theme.typography.fontSize * 2,
        },
        '& > p': {
            color: theme.palette.text.secondary,
            maxWidth: '40%',
            marginTop: theme.spacing(4),
            fontSize: theme.typography.fontSize * 1.5,
        },
    },
    logo: {
        position: 'fixed',
        zIndex: -1,
        bottom: '15%',
        right: '10%',
        maxWidth: '30vw',
    },
}));

export const CustomHomePage = () => {
    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <HomePageContent className={classes.markdown} />
                <ContentLogo className={classes.logo} />
            </div>
            <CustomFooter />
        </>
    );
};
