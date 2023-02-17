import React, { useState } from 'react';
import { useQuery } from 'react-admin';
import { useTranslate, linkToRecord, useDataProvider } from 'ra-core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import uniq from 'lodash/uniq';
import flatMap from 'lodash/flatMap';
import union from 'lodash/union';
import map from 'lodash/map';

import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ApiStatus } from '../apis/ApiStatus';
import { useLayer7Notify } from '../useLayer7Notify';

export const ApplicationApisList = ({ apiIds, apiGroupIds, application }) => {
    const apis = apiIds;

    const classes = useStyles();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const notify = useLayer7Notify();
    const [apiPlansEnabled, setApiPlansEnabled] = useState(false);
    const [selectedApiGroups, setSelectedApiGroups] = useState([]);
    const [appApis, setAppApis] = useState([]);

    const { data: allApis = [] } = useQuery({
        type: 'getApis',
        resource: 'apis',
    });

    const {
        data: apiPlanFeatureFlag,
        error,
        loading: isLoadingApiPlansFeatureFlag,
    } = useQuery({
        type: 'getApiPlansFeatureFlag',
        resource: 'apiPlans',
        payload: {},
    });

    React.useEffect(() => {
        if (apiPlanFeatureFlag) {
            setApiPlansEnabled(apiPlanFeatureFlag.value === 'true');
        }
    }, [apiPlanFeatureFlag]);

    React.useEffect(() => {
        async function fetchInitialSelectedItems() {
            if (
                apiGroupIds &&
                apiGroupIds.length &&
                !selectedApiGroups.length
            ) {
                const { data: apiGroups } = await dataProvider.getList(
                    'apiGroups',
                    {
                        filter: {
                            orgUuid: application.organizationUuid,
                            applicationUuid: application.id,
                        },
                        pagination: { page: 1, perPage: 100 },
                    },
                    {
                        onFailure: error => notify(error),
                    }
                );
                const appApiGroups = apiGroups.filter(apiGroup =>
                    apiGroupIds.find(id => apiGroup.id === id)
                );
                setSelectedApiGroups(appApiGroups);
            }
        }
        if (apis && allApis && allApis.length) {
            fetchInitialSelectedItems();
            const apiGroupsList = getAppApiGroupsApisList(selectedApiGroups);
            const allSelectedApis = union(apis, apiGroupsList);

            const listedApis = apis ? getAppApis(allApis, allSelectedApis) : [];
            if (listedApis && listedApis.length > 0) {
                setAppApis(listedApis);
            }
        }
    }, [apis, allApis, selectedApiGroups]);

    return (
        <ExpansionPanel square defaultExpanded>
            <ExpansionPanelSummary
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
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
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
                                        to={linkToRecord(
                                            '/apis',
                                            row && row.id,
                                            'show'
                                        )}
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
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

const getAppApis = (allApis, selectedApis) =>
    allApis.filter(api => selectedApis.includes(api.id));

const getAppApiGroupsApisList = list =>
    uniq(flatMap(list, ({ apis }) => map(apis, api => api.uuid)));

const ExpansionPanel = withStyles(theme => ({
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
}))(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles(theme => ({
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
}))(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        padding: theme.spacing(0, 0, 0),
        border: 'none',
    },
}))(MuiExpansionPanelDetails);

const useStyles = makeStyles(
    theme => ({
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
                margin: `${theme.spacing(1)}px 0 !important`,
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
        },
        description: {
            marginTop: theme.spacing(0),
            fontSize: theme.typography.pxToRem(14),
        },
    }),
    {
        name: 'Layer7ApplicationApisList',
    }
);
