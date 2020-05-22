import React from 'react';
import { TextField } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import get from 'lodash/get';

const useTruncatedTextFieldStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '15vw',
        [theme.breakpoints.up('lg')]: {
            maxWidth: '10vw',
        },
    },
}));

export const TruncatedTextField = props => {
    const classes = useTruncatedTextFieldStyles();
    const value = get(props.record, props.source);

    return (
        <Tooltip title={value || ''}>
            <TextField className={classes.root} {...props} />
        </Tooltip>
    );
};
