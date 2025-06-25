// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useEffect, useState } from 'react';
import { useTranslate, useDataProvider } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';

import { useLayer7Notify } from '../../useLayer7Notify';
import { useMutation } from '@tanstack/react-query';

const emptyFunction = () => {};

export const ApiApplications = ({ handleKeyUpdate = emptyFunction, id }) => {
    const translate = useTranslate();
    const { classes } = useStyles();
    const dataProvider = useDataProvider();
    const notify = useLayer7Notify();
    const [selectedApp, setSelectedApp] = useState();
    const [open, setOpen] = useState(false);
    const [applications, setApplications] = useState([]);
    const [apiKeys, setApiKeys] = useState([]);
    const [selectedAPIKey, setSelectedAPIKey] = useState();
    const [search, setSearch] = useState('');
    const [loadingApplications, setLoadingApplications] = useState(false);
    const [loadingAPIKeys, setLoadingAPIKeys] = useState(false);
    const [currentAppPage, setCurrentAppPage] = useState(1);
    const [currentAPIkeyPage, setCurrentAPIkeyPage] = useState(0);
    const { mutateAsync: fetchApplicationsAsync } = useMutation({
        mutationFn: ({ filter, pagination, sort }) =>
            dataProvider.getList('applications', {
                filter,
                pagination,
                sort,
            }),
        onError: error => notify(error),
    });
    const { mutateAsync: fetchApiKeysAsync } = useMutation({
        mutationFn: ({ meta, pagination, sort }) =>
            dataProvider.getList('apiKeys', {
                meta,
                pagination,
                sort,
            }),
        onError: error => notify(error),
    });

    const fetchApplications = async () => {
        const { data, totalPages } = await fetchApplicationsAsync({
            filter: {
                apiUuid: id,
                name: search,
            },
            pagination: { page: currentAppPage, perPage: 10 },
            sort: { field: 'name', order: 'ASC' },
        });

        return [data, totalPages];
    };

    const fetchAPIKeys = async () => {
        const { data, totalPages } = await fetchApiKeysAsync({
            meta: { applicationUuid: selectedApp.id },
            pagination: { page: currentAPIkeyPage, perPage: 10 },
            sort: { field: 'createTs', order: 'DESC' },
        });

        return [data, totalPages];
    };

    const handleAPIKeyChange = evt => {
        setSelectedAPIKey(evt.target.value);
    };

    useEffect(() => {
        let active = true;

        (async () => {
            if (!selectedApp) {
                return;
            }

            const [data, totalPages] = await fetchAPIKeys();

            if (active) {
                setApiKeys(uniqBy([...apiKeys, ...data], 'apiKey'));
                if (currentAPIkeyPage < totalPages) {
                    setCurrentAPIkeyPage(currentAPIkeyPage + 1);
                } else {
                    setLoadingAPIKeys(false);
                }
            }
        })();

        return () => {
            active = false;
        };
        // eslint-disable-next-line
    }, [selectedApp, currentAPIkeyPage]);

    const onSearch = event => {
        setCurrentAppPage(1);
        setLoadingApplications(true);
        setSearch(event.target.value);
    };

    useEffect(() => {
        if (!open) {
            setLoadingApplications(false);
            setSearch('');
        }
    }, [open]);

    useEffect(() => {
        if (handleKeyUpdate) {
            const apiKey = find(apiKeys, item => item.id === selectedAPIKey);
            handleKeyUpdate(apiKey);
        }
    }, [apiKeys, handleKeyUpdate, selectedAPIKey]);

    useEffect(() => {
        let active = true;

        (async () => {
            const [data, totalPages] = await fetchApplications(search);
            if (active) {
                setApplications(uniqBy([...applications, ...data], 'id'));
                if (currentAppPage < totalPages) {
                    setCurrentAppPage(currentAppPage + 1);
                } else {
                    setLoadingApplications(false);
                }
            }
        })();

        return () => {
            active = false;
        };
        // eslint-disable-next-line
    }, [search, currentAppPage]);

    const getOptionLabelDefaultFn = option => {
        if (!option || typeof option !== 'object') return '';
        return option.name || '';
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={7}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        {translate('resources.applications.name', {
                            smart_count: 1,
                        })}
                    </Typography>
                    <FormControl className={classes.formControl}>
                        <Autocomplete
                            style={{ width: 500 }}
                            freeSolo
                            open={open}
                            onOpen={() => setOpen(true)}
                            onClose={(event, reason) => setOpen(false)}
                            onChange={(event, app, reason) => {
                                setCurrentAPIkeyPage(1);
                                setApiKeys([]);
                                setSelectedApp(app);
                                setSelectedAPIKey();
                            }}
                            isOptionEqualToValue={(option, value) =>
                                option.name === value.name
                            }
                            getOptionLabel={getOptionLabelDefaultFn}
                            options={applications}
                            loading={loadingApplications}
                            loadingText={translate('ra.action.loading')}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    onChange={onSearch}
                                    label={translate(
                                        'resources.apis.specification.actions.search_or_select_application'
                                    )}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loadingApplications ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        {translate('resources.applications.fields.apiKeyName')}
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel id={'api-key-select-label'}>
                            {translate(
                                'resources.apis.specification.actions.select_api_key'
                            )}
                        </InputLabel>
                        <Select
                            disabled={!selectedApp}
                            id={'api-key-select'}
                            input={<Input />}
                            inputProps={{
                                variant: 'outlined',
                            }}
                            labelId={'api-key-select-label'}
                            loading={loadingAPIKeys}
                            onChange={handleAPIKeyChange}
                            value={selectedAPIKey || ''}
                        >
                            {apiKeys.map(apiKey => (
                                <MenuItem key={apiKey.id} value={apiKey.id}>
                                    {apiKey.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApiApplications' })(theme => ({
    root: {
        fontFamily: theme.typography.body2.fontFamily,
        padding: '0px 20px',
    },
    formControl: {
        minWidth: '240px',
    },
}));
