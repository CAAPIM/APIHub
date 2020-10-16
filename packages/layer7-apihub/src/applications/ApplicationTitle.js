import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { ApplicationStatus } from './ApplicationStatus';

export const ApplicationTitle = ({ record, ...rest }) => {
    const classes = useStyles(rest);

    if (!record) {
        return null;
    }

    return (
        <div className={classes.root}>
            <div>
                <span className={classes.title}>{record.name}</span>
                <ApplicationStatus
                    classes={{ status: classes.status }}
                    record={record}
                />
            </div>
        </div>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        title: {},
        status: {
            padding: theme.spacing(1, 0),
        },
    }),
    {
        name: 'Layer7ApplicationTitle',
    }
);
