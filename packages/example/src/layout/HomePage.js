import React from 'react';
import { HomePageContent } from 'layer7-apihub';
import { makeStyles } from '@material-ui/core/styles';

import { ContentLogo, Footer } from '../ui';

export const HomePage = () => {
    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <HomePageContent className={classes.markdown} />
                <ContentLogo className={classes.logo} />
            </div>
            <Footer />
        </>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
    markdown: {
        overflowWrap: 'anywhere',
        color: theme.palette.text.primary,
        '& > p': {
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
