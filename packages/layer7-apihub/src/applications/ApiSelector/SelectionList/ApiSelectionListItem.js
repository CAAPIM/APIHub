import * as React from 'react';
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    ListItem,
    ListItemSecondaryAction,
    IconButton,
    Tooltip,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useTranslate } from 'ra-core';

import { ApiSelectedItem } from './ApiSelectedItem';
import { ApiSelectionModal } from '../ApiSelectionModal';
import { ApiStatus } from '../../../apis/ApiStatus';

export function ApiSelectionListItem(props) {
    const { className, onRemoved, onApiPlanChanged, item, orgUuid } = props;
    const { record } = item;
    const [editApiPlan, setEditApiPlan] = React.useState(false);
    const translate = useTranslate();
    const classes = useStyles(props);

    const handleItemRemoved = event => {
        if (onRemoved) {
            onRemoved(event, item);
        }
    };

    const handleApiPlanChanged = event => {
        setEditApiPlan(false);
        if (onApiPlanChanged) {
            onApiPlanChanged(event, record);
        }
    };

    const truncate = text => {
        const width = 20;
        if (text.length > width) {
            return `${text.slice(0, width).trim()}...`;
        } else {
            return text;
        }
    };

    return (
        <>
            <ExpansionPanel className={className}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Tooltip
                        title={translate('ra.action.delete')}
                        className={classes.delete}
                    >
                        <IconButton
                            onClick={handleItemRemoved}
                            edge="end"
                            aria-label={translate('ra.action.delete')}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <div className={classes.root}>
                        <Typography>{record.name}</Typography>
                        <Typography className={classes.version}>
                            v{record.version}
                        </Typography>
                        <ApiStatus record={record} variant="caption" />
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className={classes.description}>
                        {record.apiPlan ? (
                            <div className={classes.apiPlanDetails}>
                                {translate(
                                    'resources.applications.fields.apiPlan'
                                )}
                                : {truncate(record.apiPlan.name)}
                                <span className={classes.apiPlanInterval}>
                                    (
                                    {record.apiPlan.quota
                                        ? `${translate(
                                              'resources.apiPlans.fields.quota'
                                          )}: ${
                                              record.apiPlan.quota
                                          }/${translate(
                                              `resources.apiPlans.fields.${record.apiPlan.quotaInterval.toLowerCase()}`
                                          )}`
                                        : null}
                                    {record.apiPlan.rateLimit
                                        ? `${translate(
                                              'resources.apiPlans.fields.rate_limit'
                                          )}: ${
                                              record.apiPlan.rateLimit
                                          }/${translate(
                                              `resources.apiPlans.fields.second`
                                          )}`
                                        : null}
                                    )
                                </span>
                                <Tooltip
                                    title={translate(
                                        'resources.applications.actions.edit'
                                    )}
                                >
                                    <IconButton
                                        aria-label="actions"
                                        onClick={() => setEditApiPlan(true)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        ) : null}
                        {record.description}
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ApiSelectionModal
                api={editApiPlan ? record : null}
                onConfirm={handleApiPlanChanged}
                onCancel={() => {
                    setEditApiPlan(false);
                }}
                apiPlansEnabled={true}
                source="ApiApiPlanIds"
                orgUuid={orgUuid}
            />
        </>
    );
}

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        version: {
            color: theme.palette.text.secondary,
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        delete: {
            marginRight: theme.spacing(0),
        },
        apiPlanDetails: {
            fontSize: theme.typography.pxToRem(14),
            marginTop: theme.spacing(0),
        },
        apiPlanInterval: {
            marginLeft: theme.spacing(1),
        },
        description: {
            marginTop: theme.spacing(-1),
            marginLeft: theme.spacing(6),
            fontSize: theme.typography.pxToRem(14),
        },
    }),
    {
        name: 'Layer7SelectedItem',
    }
);
