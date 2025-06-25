// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import { makeStyles } from 'tss-react/mui';

export function ApiSelectionModalTaC(props) {
    const { content } = props;
    const { classes } = useStyles(props);

    return (
        <div
            className={classes.content}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

const useStyles = makeStyles({ name: 'Layer7ApplicationApiSelectionModalTaC' })(
    {
        content: {
            overflow: 'scroll',
        },
    }
);
