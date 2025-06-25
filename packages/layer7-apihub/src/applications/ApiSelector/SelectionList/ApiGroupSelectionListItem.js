// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import {
    Chip,
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
import { useTranslate } from 'react-admin';

import { ApiStatus } from '../../../apis/ApiStatus';

export function ApiGroupSelectionListItem(props) {
    const { className, onRemoved, item, disabled } = props;
    const translate = useTranslate();
    const { classes } = useStyles(props);

    const handleItemRemoved = event => {
        if (onRemoved) {
            onRemoved(event, item);
        }
    };

    return (
        (<Accordion className={className}>
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
                    <Chip
                        className={classes.chip}
                        label={translate(`resources.apiGroups.short_name`, {
                            smart_count: 1,
                        })}
                    />
                    <Typography>{item.record.name}</Typography>
                    <Typography className={classes.apisCount}>
                        ({item.record.apis.length})
                    </Typography>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <div className={classes.details}>
                    <div className={classes.list}>
                        {item.record.apis.map(api => (
                            <div className={classes.api} key={api.uuid}>
                                <div>{api.name}</div>
                                <ApiStatus record={api} variant="caption" />
                            </div>
                        ))}
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>)
    );
}

const useStyles = makeStyles({ name: 'Layer7SelectedItem' })(
    theme => ({
        root: {
            display: 'flex',
            alignItems: 'center',
        },
        chip: {
            marginRight: theme.spacing(1),
            height: theme.spacing(3),
        },
        apisCount: {
            color: theme.palette.text.secondary,
            marginLeft: theme.spacing(1),
        },
        delete: {
            marginRight: theme.spacing(1),
        },
        details: {
            marginTop: theme.spacing(-2),
            marginLeft: theme.spacing(6),
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
        },
        description: {
            marginTop: theme.spacing(0),
            fontSize: theme.typography.pxToRem(14),
        },
        list: {
            marginTop: theme.spacing(1),
            width: '100%',
        },
        api: {
            display: 'flex',
            justifyContent: 'space-between',
            textAlign: 'left',
            marginTop: theme.spacing(1),
        },
    })
);
