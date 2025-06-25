// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate, useGetOne } from 'react-admin';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import SwaggerUI from 'swagger-ui-react';

import 'swagger-ui-react/swagger-ui.css';
import { makeStyles } from 'tss-react/mui';

export const Swagger = ({ apiKeyDetails, id }) => {
    const translate = useTranslate();
    const { classes } = useStyles();
    const { apiKey, keySecret } = apiKeyDetails || {};

    const { data, isLoading, error } = useGetOne('specs', { id });

    if (isLoading) {
        return <LinearProgress />;
    }

    if (!data || error) {
        return (
            <Typography variant="body2" color="error">
                {translate('ra.page.error')}
            </Typography>
        );
    }

    return (
        <div className={classes.swagger}>
            <SwaggerUI
                key={apiKey}
                onComplete={system => {
                    system.initOAuth({
                        clientId: apiKey,
                        clientSecret: keySecret,
                    });
                }}
                spec={data}
            />
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7Swagger' })(theme => ({
    swagger: {
        backgroundColor: theme.palette.common.white,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
    },
}));
