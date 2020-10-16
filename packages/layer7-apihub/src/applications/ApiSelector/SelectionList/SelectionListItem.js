import * as React from 'react';
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    ListItem,
    ListItemSecondaryAction,
    IconButton,
    Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTranslate } from 'ra-core';

import { ApiSelectedItem } from './ApiSelectedItem';
import { ApiGroupSelectedItem } from './ApiGroupSelectedItem';
import { ApiStatus } from '../../../apis/ApiStatus';

export function SelectionListItem(props) {
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
                    {item.type === 'apis' ? (
                        <ApiSelectedItem item={item} />
                    ) : (
                        <ApiGroupSelectedItem item={item} />
                    )}
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <div className={classes.details}>
                    <div className={classes.description}>
                        {item.record.description}
                    </div>
                    <ApiStatus record={item.record} variant="caption" />
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
    }),
    {
        name: 'Layer7SelectedItem',
    }
);
