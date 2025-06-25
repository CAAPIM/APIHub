// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { useEffect, useState } from 'react';
import { useTranslate, useDataProvider } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import sortBy from 'lodash/sortBy';

import { useLayer7Notify } from '../../useLayer7Notify';
import { useMutation } from '@tanstack/react-query';
/**
 * Component responsible for fetching and displaying an application's credentials
 * @param {String} id. The application identifier
 */
export const ApiApplicationCredentials = ({ id }) => {
    const { classes } = useStyles();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const notify = useLayer7Notify();
    const [application, setApplication] = useState();
    const [apiKey, setApiKey] = useState({});
    const { mutateAsync } = useMutation();

    const fetchApplication = async () => {
        const { data } = await mutateAsync(
            () => dataProvider.getOne('applications', { id }),
            {
                onError: error => notify(error),
            }
        );
        return data;
    };

    const fetchApiKeys = async () => {
        const { data } = await mutateAsync(
            () =>
                dataProvider.getList('apiKeys', {
                    applicationUuid: id,
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'createTs', order: 'DESC' },
                }),
            {
                onError: error => notify(error),
            }
        );
        return data;
    };

    useEffect(() => {
        const fetchData = async () => {
            const applicationData = await fetchApplication();
            const apiKeysData = await fetchApiKeys();
            setApplication(applicationData);
            const apiKeys = sortBy(
                apiKeysData,
                ({ defaultKey }) => !defaultKey
            );
            setApiKey(apiKeys.length > 0 ? apiKeys[0] : {});
        };

        fetchData();
    }, [id]);

    if (!application) {
        return <CircularProgress color="primary" />;
    }

    return (
        <div className={classes.root}>
            <Typography variant="subtitle1" className={classes.mainKey}>
                <span className={classes.label}>
                    {translate('resources.applications.fields.apiKey')}
                </span>
                <span id={`api-key-${application.id}`}>{apiKey.apiKey}</span>
            </Typography>
            <Typography variant="body2" className={classes.secondaryKey}>
                <span className={classes.label}>
                    {translate('resources.applications.fields.keySecret')}
                </span>
                <span id={`shared-secret-${application.id}`}>
                    {apiKey.keySecret}
                </span>
            </Typography>
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApiApplicationCredentials' })(
    theme => ({
        root: {
            border: `solid 1px ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            paddingBottom: theme.spacing(3),
            paddingTop: theme.spacing(3),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
        },
        mainKey: {
            color: theme.palette.text.primary,
            fontWeight: theme.typography.fontWeightBold,
            wordBreak: 'break-all',
        },
        secondaryKey: {
            color: theme.palette.text.primary,
            wordBreak: 'break-all',
        },
        label: {
            marginRight: theme.spacing(1),
        },
    })
);
