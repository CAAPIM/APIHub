// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useCallback, useState } from 'react';
import { makeStyles } from 'tss-react/mui';

import { ApiApplications } from './Application';
import { Swagger } from './Swagger';
import { useGetRecordId } from 'react-admin';

export const ApiSpecs = () => {
    const { classes } = useStyles();
    const id = useGetRecordId();

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
            <ApiApplications handleKeyUpdate={handleKeyUpdate} id={id} />
            <Swagger apiKeyDetails={selectedAPIkey} id={id} />
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApiSpecs' })(theme => ({
    root: {
        color: theme.palette.secondary.main,
        fontWeight: theme.typography.fontWeightBold,
        padding: theme.spacing(),

        '& .swagger-ui .wrapper': {
            maxWidth: 'unset',
        },
    },
}));
