// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import { makeStyles } from 'tss-react/mui';
import { ListArrayInputItemContext } from './ListArrayInputItemContext';

/**
 * Internal component responsible for displaying a choice inside <ListArrayInput />
 */
export function ListArrayInputItem(props) {
    const { children, onAdd, onRemove, record, selected } = props;
    const { classes } = useStyles(props);

    const handleAdd = event => {
        onAdd(event, record);
    };

    const handleRemove = event => {
        onRemove(event, record);
    };

    return (
        <div className={classes.root}>
            <ListArrayInputItemContext.Provider
                value={{
                    record,
                    onAdd: handleAdd,
                    onRemove: handleRemove,
                    selected,
                }}
            >
                {children}
            </ListArrayInputItemContext.Provider>
        </div>
    );
}

const useStyles = makeStyles({ name: 'Layer7ListArrayInputItemContext' })(
    theme => ({
        root: {
            alignItems: 'flex-start',
            '&:not(:last-child)': {
                borderBottomStyle: 'solid',
                borderWidth: 1,
                borderColor: theme.palette.grey[400],
            },
            paddingLeft: 0,
        },
        button: {},
    })
);
