// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslate, useDataProvider, useCreatePath } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import { withStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import uniq from 'lodash/uniq';
import flatMap from 'lodash/flatMap';
import union from 'lodash/union';
import map from 'lodash/map';

import MuiExpansionPanel from '@mui/material/Accordion';
import MuiExpansionPanelSummary from '@mui/material/AccordionSummary';
import MuiExpansionPanelDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ApiStatus } from '../apis/ApiStatus';
import { useLayer7Notify } from '../useLayer7Notify';

export const ApplicationApisList = ({ apiIds, apiGroupIds, application }) => {
    const { classes } = useStyles();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const notify = useLayer7Notify();
    const [selectedApiGroups, setSelectedApiGroups] = useState([]);
    const [appApis, setAppApis] = useState([]);
    const { mutateAsync } = useMutation({
        mutationFn: ({ pagination, filter }) =>
            dataProvider.getList('apiGroups', {
                pagination,
                filter,
            }),
    });
    const createPath = useCreatePath();
    const { data: allApis, isSuccess: fetchApisIsSuccess } = useQuery({
        queryKey: ['apis', 'getApis'],
        queryFn: () => dataProvider.getApis('apis'),
        retry: false,
    });

    useEffect(() => {
        async function fetchInitialSelectedItems() {
            if (
                apiGroupIds &&
                apiGroupIds.length &&
                !selectedApiGroups.length
            ) {
                const { data } = await mutateAsync(
                    {
                        filter: {
                            orgUuid: application.organizationUuid,
                            applicationUuid: application.id,
                        },
                        pagination: { page: 1, perPage: 100 },
                    },
                    {
                        onError: error => notify(error),
                    }
                );

                const appApiGroups = data.filter(apiGroup =>
                    apiGroupIds.find(id => apiGroup.id === id)
                );
                setSelectedApiGroups(appApiGroups);
            }
        }
        if (apiIds && fetchApisIsSuccess && allApis.data.length) {
            fetchInitialSelectedItems();
            const apiGroupsList = getAppApiGroupsApisList(selectedApiGroups);
            const allSelectedApis = union(apiIds, apiGroupsList);

            const listedApis = apiIds
                ? getAppApis(allApis.data, allSelectedApis)
                : [];
            if (listedApis && listedApis.length > 0) {
                setAppApis(listedApis);
            }
        }
    }, [allApis, selectedApiGroups]);

    return (
        <Accordion square defaultExpanded>
            <AccordionSummary
                className={classes.expansionPanelSummary}
                expandIcon={
                    <ExpandMoreIcon className={classes.expandMoreIconSummary} />
                }
                aria-controls="apilistpanel-content"
                id="apilistpanel-header"
            >
                <Typography variant="subtitle1" className={classes.heading}>
                    {translate('resources.applications.fields.apis')} (
                    {appApis.length})
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div className={classes.details}>
                    {appApis &&
                        appApis.map(row => (
                            <div
                                className={classes.additionalDetails}
                                key={row.id}
                            >
                                <div className={classes.title}>
                                    <Link
                                        component={RouterLink}
                                        to={createPath({
                                            resource: 'apis',
                                            id: row.id,
                                            type: 'show',
                                        })}
                                    >
                                        {row.name} v{row.version}
                                    </Link>
                                    <ApiStatus record={row} variant="caption" />
                                </div>
                                <div className={classes.description}>
                                    {row.description}
                                </div>
                            </div>
                        ))}
                </div>
            </AccordionDetails>
        </Accordion>
    );
};

const getAppApis = (allApis, selectedApis) =>
    allApis.filter(api => selectedApis.includes(api.id));

const getAppApiGroupsApisList = list =>
    uniq(flatMap(list, ({ apis }) => map(apis, api => api.uuid)));

const Accordion = withStyles(MuiExpansionPanel, theme => ({
    root: {
        width: '100%',
        border: 'none',
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
}));

const AccordionSummary = withStyles(MuiExpansionPanelSummary, theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
        padding: 0,
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
}));

const AccordionDetails = withStyles(MuiExpansionPanelDetails, theme => ({
    root: {
        padding: theme.spacing(0, 0, 0),
        border: 'none',
    },
}));

const useStyles = makeStyles({ name: 'Layer7ApplicationApisList' })(theme => ({
    root: {
        width: '100%',
    },
    table: {
        minWidth: '100%',
    },
    container: {
        maxHeight: '100%',
    },
    expandMoreIconSummary: {
        color: theme.palette.primary.main || '#333333',
    },
    expansionPanelSummary: {
        '& > div': {
            margin: `${theme.spacing(1)} 0 !important`,
        },
    },
    heading: {
        color: theme.palette.primary.main || '#333333',
        fontFamily: theme.typography.textHub,
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '21px',
        lineHeight: '22px',
        margin: theme.spacing(1, 0, 1, 0),
        transform: 'unset',
        textTransform: 'titlecase',
    },
    title: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    details: {
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(3),
        width: '100%',
        fontSize: '1rem',
    },
    additionalDetails: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(10),
    },
    description: {
        marginTop: theme.spacing(0),
        fontSize: theme.typography.pxToRem(14),
    },
}));
