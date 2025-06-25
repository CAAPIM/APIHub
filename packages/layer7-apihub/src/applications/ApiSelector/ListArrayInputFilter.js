// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import { SearchInput, useChoicesContext, useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';

export function ListArrayInputFilter() {
    const translate = useTranslate();
    const { setFilters } = useChoicesContext();
    const { classes } = useStyles();

    return (
        <>
            <SearchInput
                className={classes.inputFilter}
                source="q"
                onChange={event => setFilters({ q: event?.target?.value })}
                placeholder={translate(
                    'resources.applications.actions.searchByApiTitle'
                )}
            />
        </>
    );
}

const useStyles = makeStyles({ name: 'Layer7ApiInput' })(theme => ({
    inputFilter: {
        marginTop: theme.spacing(1),
    },
}));
