import * as React from 'react';
import { List, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'ra-core';

import { ApiSelectionListItem } from './ApiSelectionListItem';
import { ApiGroupSelectionListItem } from './ApiGroupSelectionListItem';

export function SelectionList(props) {
    const { onItemRemoved, selectedItems } = props;
    const translate = useTranslate();
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography>
                    {translate('ra.action.bulk_actions', {
                        smart_count: selectedItems.length,
                    })}
                </Typography>
            </div>
            {!selectedItems || selectedItems.length === 0 ? (
                <div className={classes.empty} />
            ) : (
                <div>
                    {selectedItems.map((item, index) => {
                        return item.type === 'apis' ? (
                            <ApiSelectionListItem
                                className={classes.item}
                                key={item.record.id}
                                onRemoved={onItemRemoved}
                                item={item}
                            />
                        ) : (
                            <ApiGroupSelectionListItem
                                className={classes.item}
                                key={item.record.id}
                                onRemoved={onItemRemoved}
                                item={item}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        },
        empty: {
            flexGrow: 1,
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: theme.palette.grey[500],
        },
        header: {
            // The following styles ensure the header text is
            // correctly aligned with the tabs on the right
            display: 'flex',
            minHeight: 48,
            alignItems: 'center',
        },
        item: {
            minHeight: 48,
            '&:not(:last-child)': {
                borderBottomStyle: 'solid',
                borderWidth: 1,
                borderColor: theme.palette.grey[400],
            },
        },
    }),
    {
        name: 'Layer7SelectionList',
    }
);
