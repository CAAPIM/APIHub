import React, { useState } from 'react';
import { useTranslate, useDataProvider } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import uniqBy from 'lodash/uniqBy';

import { ApiApplicationCredentials } from './ApiApplicationCredentials';
import { useLayer7Notify } from '../../useLayer7Notify';

export const ApiApplications = ({ id }) => {
    const translate = useTranslate();
    const classes = useStyles();
    const dataProvider = useDataProvider();
    const notify = useLayer7Notify();
    const [selectedApp, setSelectedApp] = useState();
    const [open, setOpen] = React.useState(false);
    const [applications, setApplications] = useState([]);
    const [search, setSearch] = React.useState(undefined);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);

    const fetchApplications = async searchValue => {
        const { data, total } = await dataProvider.getList(
            'applications',
            {
                filter: {
                    apiUuid: id,
                    name: search,
                },
                pagination: { page: currentPage, perPage: 10 },
                sort: { field: 'name', order: 'ASC' },
            },
            {
                onFailure: error => notify(error),
            }
        );

        return [data, total];
    };

    const onSearch = event => {
        setCurrentPage(1);
        setLoading(true);
        setSearch(event.target.value);
    };

    React.useEffect(() => {
        if (!open) {
            setLoading(false);
            setSearch(undefined);
        }
    }, [open]);

    React.useEffect(() => {
        let active = true;

        if (!search || search.length < 2) {
            return undefined;
        }

        (async () => {
            const [data, total] = await fetchApplications(search);

            if (active) {
                if (data.length == total) {
                    setApplications(data);
                    setLoading(false);
                } else if (applications.length < total) {
                    setApplications(
                      uniqBy([ ...applications, ...data ], 'uuid')
                    );
                    setCurrentPage(currentPage+1);
                } else {
                    setLoading(false);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [search, currentPage]);

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
                                setSelectedApp(app)
                                if (reason == 'clear') {
                                    setApplications([])  
                                }
                            }}
                            getOptionSelected={(option, value) =>
                                option.name === value.name
                            }
                            getOptionLabel={option => option.name}
                            options={applications}
                            loading={loading}
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
                                                {loading ? (
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
                    <Typography color="textSecondary">
                        {translate(
                            'resources.apis.specification.actions.select_application'
                        )}
                    </Typography>
                </Grid>
                <Grid item xs={5}>
                    {selectedApp && (
                        <ApiApplicationCredentials id={selectedApp.id} />
                    )}
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
