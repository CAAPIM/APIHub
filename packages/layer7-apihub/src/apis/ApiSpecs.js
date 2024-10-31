import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { ApiApplications } from './Application';
import { Swagger } from './Swagger';

export const ApiSpecs = ({ record }) => {
    const classes = useStyles();

    const [selectedAPIkey, setSelectedAPIKey] = useState({});
    const handleKeyUpdate = useCallback(keyDetails => {
        if (keyDetails) {
            setSelectedAPIKey(keyDetails);
        } else {
            setSelectedAPIKey({});
        }
    }, []);
    return (
        <div className={classes.root}>
            <ApiApplications handleKeyUpdate={handleKeyUpdate} id={record.id} />
            <Swagger apiKeyDetails={selectedAPIkey} id={record.id} />
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
