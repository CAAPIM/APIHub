// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate } from 'react-admin';

import { ApiStatus } from '../../apis/ApiStatus';
import { useListArrayInputItem } from '../../ui';

export function ApiChoiceItem(props) {
    const { record, selected, onAdd } = useListArrayInputItem();
    const { classes } = useStyles(props);
    const translate = useTranslate();

    return (
        (<Accordion>
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
                    <Typography className={classes.version}>
                        v{record.version}
                    </Typography>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <div className={classes.details}>
                    {record.tags &&
                        record.tags.map((tag, i) => (
                            <Chip key={i} label={tag} className={classes.tag} />
                        ))}
                    <div className={classes.additionalDetails}>
                        <div className={classes.description}>
                            {record.description}
                        </div>
                        <ApiStatus record={record} variant="caption" />
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>)
    );
}

const useStyles = makeStyles({ name: 'Layer7ApiChoiceItem' })(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    add: {
        marginTop: theme.spacing(-1),
    },
    version: {
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(1),
    },
    details: {
        marginTop: theme.spacing(-2),
        marginLeft: theme.spacing(6),
        width: '100%',
    },
    additionalDetails: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(2),
    },
    description: {
        marginTop: theme.spacing(0),
        fontSize: theme.typography.pxToRem(14),
    },
    tag: {
        marginRight: theme.spacing(1),
        height: theme.spacing(3),
    },
    status: {
        marginTop: theme.spacing(0),
        fontSize: theme.typography.pxToRem(14),
    },
}));
