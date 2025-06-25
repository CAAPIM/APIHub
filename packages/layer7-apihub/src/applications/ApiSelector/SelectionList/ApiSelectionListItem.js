// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslate } from 'react-admin';

import { ApiSelectionModal } from '../ApiSelectionModal';
import { ApiStatus } from '../../../apis/ApiStatus';

export function ApiSelectionListItem(props) {
    const {
        className,
        onRemoved,
        onApiPlanChanged,
        item,
        orgUuid,
        disabled,
    } = props;
    const { record } = item;
    const [editApiPlan, setEditApiPlan] = React.useState(false);
    const translate = useTranslate();
    const { classes } = useStyles(props);

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

    return (<>
        <Accordion className={className}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Tooltip
                    title={translate('ra.action.delete')}
                    className={classes.delete}
                >
                    <IconButton
                        disabled={disabled}
                        onClick={handleItemRemoved}
                        edge="end"
                        aria-label={translate('ra.action.delete')}
                        size="large">
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
            </AccordionSummary>
            <AccordionDetails>
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
                                <IconButton aria-label="actions" onClick={() => setEditApiPlan(true)} size="large">
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </div>
                    ) : null}
                    {record.description}
                </div>
            </AccordionDetails>
        </Accordion>
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
    </>);
}

const useStyles = makeStyles({ name: 'Layer7SelectedItem' })(
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
    })
);
