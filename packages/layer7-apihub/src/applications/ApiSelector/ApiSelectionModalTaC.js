import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'ra-core';

export function ApiSelectionModalTaC(props) {
    const { content } = props;
    const classes = useStyles(props);
    const translate = useTranslate();

    return (
        <div
            className={classes.content}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

const useStyles = makeStyles(
    theme => ({
        content: {
            overflow: 'scroll',
        },
    }),
    {
        name: 'Layer7ApplicationApiSelectionModalTaC',
    }
);
