// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Tooltip,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslate } from 'react-admin';

import { ApiSelectedItem } from './ApiSelectedItem';
import { ApiGroupSelectedItem } from './ApiGroupSelectedItem';
import { ApiStatus } from '../../../apis/ApiStatus';

export function SelectionListItem(props) {
    const { className, onRemoved, item } = props;
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
                        onClick={handleItemRemoved}
                        edge="end"
                        aria-label={translate('ra.action.delete')}
                        size="large">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <div className={classes.root}>
                    {item.type === 'apis' ? (
                        <ApiSelectedItem item={item} />
                    ) : (
                        <ApiGroupSelectedItem item={item} />
                    )}
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <div className={classes.details}>
                    <div className={classes.description}>
                        {item.record.description}
                    </div>
                    <ApiStatus record={item.record} variant="caption" />
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
    })
);
