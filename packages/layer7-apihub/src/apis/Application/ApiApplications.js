import React, { useState } from 'react';
import { useTranslate, useDataProvider } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';

import { useLayer7Notify } from '../../useLayer7Notify';

const emptyFunction = () => {};

export const ApiApplications = ({ handleKeyUpdate = emptyFunction, id }) => {
    const translate = useTranslate();
    const classes = useStyles();
    const dataProvider = useDataProvider();
    const notify = useLayer7Notify();
    const [selectedApp, setSelectedApp] = useState();
    const [open, setOpen] = React.useState(false);
    const [applications, setApplications] = useState([]);
    const [apiKeys, setApiKeys] = useState([]);
    const [selectedAPIKey, setSelectedAPIKey] = useState();
    const [search, setSearch] = React.useState(undefined);
    const [loadingApplications, setLoadingApplications] = React.useState(false);
    const [loadingAPIKeys, setLoadingAPIKeys] = React.useState(false);
    const [currentAppPage, setCurrentAppPage] = React.useState(1);
    const [currentAPIkeyPage, setCurrentAPIkeyPage] = React.useState(0);

    const fetchApplications = async searchValue => {
        const { data, totalPages } = await dataProvider.getList(
            'applications',
            {
                filter: {
                    apiUuid: id,
                    name: search,
                },
                pagination: { page: currentAppPage, perPage: 10 },
                sort: { field: 'name', order: 'ASC' },
            },
            {
                onFailure: error => notify(error),
            }
        );
        return [data, totalPages];
    };

    const fetchAPIKeys = async () => {
        const { data, totalPages } = await dataProvider.getList(
            'apiKeys',
            {
                applicationUuid: selectedApp.id,
                pagination: { page: currentAPIkeyPage, perPage: 10 },
                sort: { field: 'createTs', order: 'DESC' },
            },
            {
                onFailure: error => notify(error),
            }
        );

        return [data, totalPages];
    };

    const handleAPIKeyChange = evt => {
        setSelectedAPIKey(evt.target.value);
    };

    React.useEffect(() => {
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

    React.useEffect(() => {
        if (!open) {
            setLoadingApplications(false);
            setSearch(undefined);
        }
    }, [open]);

    React.useEffect(() => {
        if (handleKeyUpdate) {
            const apiKey = find(apiKeys, item => item.id === selectedAPIKey);
            handleKeyUpdate(apiKey);
        }
    }, [apiKeys, handleKeyUpdate, selectedAPIKey]);

    React.useEffect(() => {
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
                            getOptionSelected={(option, value) =>
                                option.name === value.name
                            }
                            getOptionLabel={option => option.name}
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
                                            <React.Fragment>
                                                {loadingApplications ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
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

const useStyles = makeStyles(
    theme => ({
        root: {
            fontFamily: theme.typography.body2.fontFamily,
            padding: '0px 20px',
        },
        formControl: {
            minWidth: '240px',
        },
    }),
    {
        name: 'Layer7ApiApplications',
    }
);
