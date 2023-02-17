import React, { useState } from 'react';
import { useTranslate, useDataProvider } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import sortBy from 'lodash/sortBy';

import { useLayer7Notify } from '../../useLayer7Notify';
/**
 * Component responsible for fetching and displaying an application's credentials
 * @param {String} id. The application identifier
 */
export const ApiApplicationCredentials = ({ id }) => {
    const classes = useStyles();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const notify = useLayer7Notify();
    const [application, setApplication] = useState();
    const [apiKey, setApiKey] = useState({});

    const fetchApplication = async id => {
        const { data } = await dataProvider.getOne(
            'applications',
            {
                id: id,
            },
            {
                onFailure: error => notify(error),
            }
        );

        return data;
    };

    const fetchApiKeys = async (appId) => {
        const { data } = await dataProvider.getList(
            'apiKeys',
            {
                applicationUuid: appId,
                pagination: { page: 1, perPage: 100 },
                sort: { field: 'createTs', order: 'DESC' },
            },
            {
                onFailure: error => notify(error),
            }
        );
        const apiKeys = sortBy(data, ({ defaultKey }) => !defaultKey);
        setApiKey(apiKeys.length > 0 ? apiKeys[0] : {});
    };

    React.useEffect(() => {
        (async () => {
            const data = await fetchApplication(id);
            setApplication(data);
        })();
        fetchApiKeys(id);
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

const useStyles = makeStyles(
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
    }),
    {
        name: 'Layer7ApiApplicationCredentials',
    }
);
