import * as React from 'react';
import {
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Tooltip,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslate } from 'ra-core';
import { ApiStatus } from '../../apis/ApiStatus';

import { TruncatedTextField, useListArrayInputItem } from '../../ui';

export function ApiGroupChoiceItem(props) {
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
                            disabled={selected || props.disabled}
                            onClick={onAdd}
                            color="primary"
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
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
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
    }),
    {
        name: 'Layer7ApiGroupChoiceItem',
    }
);
