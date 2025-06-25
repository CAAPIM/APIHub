// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import {
    Divider,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate } from 'react-admin';
import { ApiStatus } from '../../apis/ApiStatus';

import { useListArrayInputItem } from '../../ui';

export function ApiGroupChoiceItem(props) {
    const { record, selected, onAdd } = useListArrayInputItem();
    const { classes } = useStyles(props);
    const translate = useTranslate();
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Tooltip title={translate('ra.action.add')}>
                    <span>
                        <IconButton
                            aria-label={translate('ra.action.add')}
                            className={classes.add}
                            disabled={selected || props.disabled}
                            onClick={onAdd}
                            size="large"
                        >
                            <AddIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <div className={classes.root}>
                    <Typography>{record.name}</Typography>
                    <Typography className={classes.apiCount}>
                        ({record.apis.length})
                    </Typography>
                    <Typography className={classes.status}>
                        {translate(
                            `resources.apis.portalStatus.${record.status.toLowerCase()}`
                        )}
                    </Typography>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <div className={classes.details}>
                    <Typography className={classes.description}>
                        {record.description}
                    </Typography>
                    <Divider />
                    <div className={classes.list}>
                        {record.apis.map(api => (
                            <div className={classes.api} key={api.uuid}>
                                <div>{api.name}</div>
                                <ApiStatus record={api} variant="caption" />
                            </div>
                        ))}
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>
    );
}

const useStyles = makeStyles({ name: 'Layer7ApiGroupChoiceItem' })(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    add: {
        marginTop: theme.spacing(-1),
    },
    apiCount: {
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(1),
    },
    details: {
        marginTop: theme.spacing(-2),
        marginLeft: theme.spacing(6),
        width: '100%',
    },
    status: {
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2),
        fontSize: '0.8rem',
        textTransform: 'lowercase',
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
}));
