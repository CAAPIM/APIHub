import React from 'react';
import { useTranslate, useGetOne } from 'react-admin';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import SwaggerUI from 'swagger-ui-react';

import 'swagger-ui-react/swagger-ui.css';
import { makeStyles } from '@material-ui/core';

export const Swagger = ({ apiKeyDetails, id }) => {
    const translate = useTranslate();
    const classes = useStyles();
    const { apiKey, keySecret } = apiKeyDetails || {};

    const { data, loaded, error } = useGetOne('specs', id);

    if (!loaded) {
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

const useStyles = makeStyles(
    theme => ({
        swagger: {
            backgroundColor: theme.palette.common.white,
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
        },
    }),
    {
        name: 'Layer7Swagger',
    }
);
