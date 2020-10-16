import * as React from 'react';
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Chip,
    IconButton,
    Tooltip,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslate } from 'ra-core';

import { ApiStatus } from '../../apis/ApiStatus';
import { AccessField, useListArrayInputItem } from '../../ui';

export function ApiChoiceItem(props) {
    const { record, selected, onAdd } = useListArrayInputItem();
    const classes = useStyles(props);
    const translate = useTranslate();

    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Tooltip title={translate('ra.action.add')}>
                    <span>
                        <IconButton
                            aria-label={translate('ra.action.add')}
                            className={classes.add}
                            disabled={selected}
                            onClick={onAdd}
                            color="primary"
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
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
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
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

const useStyles = makeStyles(
    theme => ({
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
    }),
    {
        name: 'Layer7ApiChoiceItem',
    }
);
