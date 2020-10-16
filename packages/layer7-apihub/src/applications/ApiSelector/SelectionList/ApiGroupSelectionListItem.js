import * as React from 'react';
import {
    Chip,
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
import { useTranslate } from 'ra-core';

import { ApiSelectedItem } from './ApiSelectedItem';
import { ApiGroupSelectedItem } from './ApiGroupSelectedItem';
import { ApiStatus } from '../../../apis/ApiStatus';

export function ApiGroupSelectionListItem(props) {
    const { className, onRemoved, item } = props;
    const translate = useTranslate();
    const classes = useStyles(props);

    const handleItemRemoved = event => {
        if (onRemoved) {
            onRemoved(event, item);
        }
    };

    return (
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
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
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
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

const useStyles = makeStyles(
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
    }),
    {
        name: 'Layer7SelectedItem',
    }
);
