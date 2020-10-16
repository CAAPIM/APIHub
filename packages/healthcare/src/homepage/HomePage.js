import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { HomePageHeader } from './HomePageHeader';
import { HomePageApiGroups } from './HomePageApiGroups';
import { HomePageExploreAPIs } from './HomePageExploreAPIs';
import { HomePageMetrics } from './HomePageMetrics';

export const HomePage = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <HomePageHeader />
            <HomePageApiGroups />
            <HomePageExploreAPIs />
            <HomePageMetrics />
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
    logo: {
        position: 'fixed',
        zIndex: -1,
        bottom: '15%',
        right: '10%',
        maxWidth: '30vw',
    },
}));
