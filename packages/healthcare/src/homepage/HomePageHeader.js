import React from 'react';
import { HomePageContent } from 'layer7-apihub';
import { makeStyles } from '@material-ui/core/styles';

import developerCenter from './developer-center.png';
import { markdownRenderer } from './markdownRenderer';

export const HomePageHeader = props => {
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <HomePageContent
                    navtitle="home"
                    entityUuid="f92fb890-21c1-43f6-b7c8-b6cb08c15doc"
                    markdownRenderer={markdownRenderer}
                />
            </div>
            <div className={classes.logo}>
                <img
                    src={developerCenter}
                    alt="Developer Center illustration"
                    className={classes.illustration}
                />
            </div>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        background: `linear-gradient(-53deg, #45108a 0%, #45108a 2%, #45108a 29%, #12054e 100%)`,
        color: theme.palette.common.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(2, 10),
        borderRadius: '5px',
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '300px',
        maxWidth: '600px',
        '& p': {
            margin: theme.spacing(2, 0),
        },
    },
    illustration: {
        width: '500px',
        padding: theme.spacing(5),
    },
}));
