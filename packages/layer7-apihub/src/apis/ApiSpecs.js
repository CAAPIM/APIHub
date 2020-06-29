import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { ApiApplications } from './Application';
import { Swagger } from './Swagger';

export const ApiSpecs = ({ record }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ApiApplications id={record.id} />
            <Swagger id={record.id} />
        </div>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            color: theme.palette.secondary.main,
            fontWeight: theme.typography.fontWeightBold,
            padding: theme.spacing(),

            '& .swagger-ui .wrapper': {
                maxWidth: 'unset',
            },
        },
    }),
    {
        name: 'Layer7ApiSpecs',
    }
);
