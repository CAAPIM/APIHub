import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

export const ApplicationTitle = ({ record, ...rest }) => {
    const classes = useTitleStyles(rest);

    if (!record) {
        return null;
    }

    return (
        <div className={classes.root}>
            <span className={classes.title}>{record.name}</span>
            <Divider className={classes.divider} />
        </div>
    );
};

const useTitleStyles = makeStyles(
    theme => ({
        root: {},
        title: {},
        divider: {
            marginTop: theme.spacing(2),
            backgroundColor: theme.palette.grey[300],
        },
        status: {
            padding: theme.spacing(1, 0),
        },
    }),
    {
        name: 'HealthcareApplicationTitle',
    }
);
